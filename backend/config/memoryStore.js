const bcrypt = require('bcryptjs');

// In-memory data tables
const store = {
  users: [],
  departments: [],
  doctors: [],
  appointments: [],
  chatHistories: [],
};

const generateId = () => {
  return Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
};

// Helper query runner
const matchesQuery = (item, query = {}) => {
  for (const key of Object.keys(query)) {
    if (key === '$or') {
      const orList = query['$or'];
      const anyMatch = orList.some((subQuery) => matchesQuery(item, subQuery));
      if (!anyMatch) return false;
      continue;
    }

    const expected = query[key];
    const actual = item[key];

    if (expected && expected.$regex) {
      const reg = new RegExp(expected.$regex, expected.$options || '');
      if (!reg.test(String(actual || ''))) return false;
      continue;
    }

    if (expected && typeof expected === 'object' && expected._bsontype) {
      if (String(actual) !== String(expected)) return false;
      continue;
    }

    if (String(actual) !== String(expected)) {
      return false;
    }
  }
  return true;
};

// Populate helper
const populateDoc = (doc, path, select) => {
  if (!doc) return doc;
  const clone = { ...doc };

  if (path === 'department') {
    const dept = store.departments.find((d) => String(d._id) === String(clone.department));
    clone.department = dept || clone.department;
  } else if (path === 'doctor') {
    const doctor = store.doctors.find((d) => String(d._id) === String(clone.doctor));
    if (doctor) {
      const doctorPop = { ...doctor };
      doctorPop.department = store.departments.find((d) => String(d._id) === String(doctor.department));
      clone.doctor = doctorPop;
    }
  } else if (path === 'patient') {
    const patient = store.users.find((u) => String(u._id) === String(clone.patient));
    clone.patient = patient || clone.patient;
  }

  return clone;
};

// Query Chainable builder
class QueryChain {
  constructor(results = []) {
    this.results = results.map((r) => ({ ...r }));
    this.populates = [];
  }

  sort(sortObj) {
    return this;
  }

  select(selectStr) {
    return this;
  }

  populate(path, select) {
    this.populates.push({ path, select });
    return this;
  }

  async then(resolve, reject) {
    try {
      let final = this.results;
      for (const pop of this.populates) {
        final = final.map((item) => populateDoc(item, pop.path, pop.select));
      }
      if (this.single) {
        const item = final.length > 0 ? wrapDocument(final[0]) : null;
        return resolve(item);
      }
      const wrapped = final.map((item) => wrapDocument(item));
      resolve(wrapped);
    } catch (err) {
      if (reject) reject(err);
      else throw err;
    }
  }
}

const wrapDocument = (doc) => {
  if (!doc) return doc;
  const copy = { ...doc };

  copy.toObject = function () {
    return { ...this };
  };

  copy.save = async function () {
    // Find in collections and update
    for (const table of Object.keys(store)) {
      const idx = store[table].findIndex((item) => String(item._id) === String(this._id));
      if (idx !== -1) {
        store[table][idx] = { ...this };
        return store[table][idx];
      }
    }
    return this;
  };

  if (copy.password) {
    copy.comparePassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
  }

  return copy;
};

// Base Memory Collection Class
class MemoryCollection {
  constructor(name, dataArray) {
    this.name = name;
    this.data = dataArray;
  }

  find(query = {}) {
    const matched = this.data.filter((item) => matchesQuery(item, query));
    return new QueryChain(matched);
  }

  findOne(query = {}) {
    let matched = [];
    if (query.$or) {
      const orMatches = this.data.find((item) => matchesQuery(item, query));
      if (orMatches) matched = [orMatches];
    } else {
      const found = this.data.find((item) => matchesQuery(item, query));
      if (found) matched = [found];
    }
    const chain = new QueryChain(matched);
    chain.single = true;
    return chain;
  }

  findById(id) {
    const found = this.data.find((item) => String(item._id) === String(id));
    const chain = new QueryChain(found ? [found] : []);
    chain.single = true;
    return chain;
  }

  async countDocuments(query = {}) {
    return this.data.filter((item) => matchesQuery(item, query)).length;
  }

  async create(docData) {
    if (Array.isArray(docData)) {
      return this.insertMany(docData);
    }
    let doc = { ...docData };
    if (!doc._id) doc._id = generateId();
    if (!doc.createdAt) doc.createdAt = new Date();
    if (!doc.updatedAt) doc.updatedAt = new Date();

    if (doc.password && !doc.password.startsWith('$2a$') && !doc.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }

    const wrapped = wrapDocument(doc);
    this.data.push(wrapped);
    return wrapped;
  }

  async insertMany(docs) {
    const inserted = [];
    for (const d of docs) {
      const item = await this.create(d);
      inserted.push(item);
    }
    return inserted;
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      this.data.length = 0;
      return { deletedCount: 0 };
    }
    const before = this.data.length;
    const remaining = this.data.filter((item) => !matchesQuery(item, query));
    this.data.length = 0;
    this.data.push(...remaining);
    return { deletedCount: before - this.data.length };
  }

  async findOneAndDelete(query = {}) {
    const index = this.data.findIndex((item) => matchesQuery(item, query));
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return wrapDocument(deleted);
    }
    return null;
  }
}

// Special Constructor for ChatHistory
class MemoryChatHistoryInstance {
  constructor(data) {
    this._id = data._id || generateId();
    this.sessionId = data.sessionId;
    this.user = data.user || null;
    this.messages = data.messages || [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const idx = store.chatHistories.findIndex((c) => c.sessionId === this.sessionId);
    if (idx !== -1) {
      store.chatHistories[idx] = this;
    } else {
      store.chatHistories.push(this);
    }
    return this;
  }
}

class MemoryChatHistoryCollection extends MemoryCollection {
  constructor() {
    super('ChatHistory', store.chatHistories);
  }

  // Support `new ChatHistory(...)`
  createInstance(data) {
    return new MemoryChatHistoryInstance(data);
  }
}

const memoryUsers = new MemoryCollection('User', store.users);
const memoryDepartments = new MemoryCollection('Department', store.departments);
const memoryDoctors = new MemoryCollection('Doctor', store.doctors);
const memoryAppointments = new MemoryCollection('Appointment', store.appointments);
const memoryChatHistories = new MemoryChatHistoryCollection();

module.exports = {
  store,
  memoryUsers,
  memoryDepartments,
  memoryDoctors,
  memoryAppointments,
  memoryChatHistories,
  MemoryChatHistoryInstance,
};
