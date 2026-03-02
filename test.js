function log(target, key, descriptor) {
  console.log(target, key, descriptor);
  return descriptor;
}

class Cool {

  @log
  static cool() {

  }

}

Cool.cool();