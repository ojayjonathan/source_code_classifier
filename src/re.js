class Re {
  static comment = /(\/\*.+\*\/)|(#(.(?!\{|\}|;))*\n)|(\/\/.*\n)|('''.*''')|(""".*""")|(<--.*--!>)/;
}
export default Re;
