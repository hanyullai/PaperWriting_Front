function is_select() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if(selection){
    return 1;
  }else{
    return 2;
  }
}
