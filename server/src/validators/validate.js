// Generic middleware factory to validate req.body against any Zod schema.
// Used across auth, property, booking, and review routes.
export const validate = (schema) => (req, res, next) => {
  // multipart/form-data sends nested objects as JSON strings (since FormData
  // can't natively hold objects/arrays); parse them back into real objects
  // before they hit Zod. Plain application/json requests are unaffected since
  // these fields would already be objects there, not strings.
  ["location", "amenities", "houseRules", "guestsCount"].forEach((field) => {
    if (typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        // leave as-is; Zod will surface a clear validation error
      }
    }
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.errors.map((e) => e.message);
    res.status(400);
    return next(new Error(messages.join(", ")));
  }
  req.body = result.data;
  next();
};
