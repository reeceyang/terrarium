function bind(func, object) {
  return function() {
    return func.apply(object, arguments);
  };
}
