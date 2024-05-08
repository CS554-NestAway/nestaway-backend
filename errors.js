export const errorType = {
    BAD_INPUT: 'BAD_INPUT',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'NOT_FOUND'
  };
  
  
  export const errorObject = (type, msg) => {
      const e = new Error(msg)
      e.type = type
      return e
  }