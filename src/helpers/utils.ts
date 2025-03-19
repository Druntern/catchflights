const sanitizeInput = (input: string) => {
  return input.replace(/[{}<>$;]/g, "");
};

export default sanitizeInput;