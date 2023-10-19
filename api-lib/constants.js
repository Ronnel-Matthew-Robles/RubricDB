export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 4, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
  },
  status: {
    name: { type: 'string', minLength: 1, maxLength: 50 },
  },
  rubric: {
    title: { type: 'string', minLength: 10, maxLength: 250 },
  },
  remark: {
    text: { type: 'string', minLength: 1, maxLength: 300 },
  },
  keyword: {
    name: { type: 'string', minLength: 1, maxLength: 50 },
  },
  department: {
    name: { type: 'string', minLength: 1, maxLength: 150 },
  },
  criteria: {
    title: { type: 'string', minLength: 10, maxLength: 250 },
    c1: { type: 'string', minLength: 1, maxLength: 500 },
    c2: { type: 'string', minLength: 1, maxLength: 500 },
    c3: { type: 'string', minLength: 1, maxLength: 500 },
    c4: { type: 'string', minLength: 1, maxLength: 500 },
  },
  activity: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
  },
  action: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
  },
  post: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
  comment: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },

};
