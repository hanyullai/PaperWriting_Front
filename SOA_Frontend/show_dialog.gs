function Waiting_Dialog() {
  var html = HtmlService.createHtmlOutputFromFile('Waiting_dialog')
      .setWidth(200)
      .setHeight(100);
  DocumentApp.getUi().showModalDialog(html, 'Please Wait');
}

function Upload_SuccessDialog() {
  var text = "Success!";
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Success');
}

function Upload_FailDialog() {
  var text = "Fail!! Please try again or make sure the file is pdf";
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Fail');
}

function Outline_generation_SuccessDialog() {
  var text = "Success!";
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Success');
}

function Outline_generation_FailDialog(){
  var text = "对不起我无法理解你的描述，请换个标题或是说法";
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Fail');
}

function Edit_SuccessDialog(explain){
  var text = explain;
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Success');
}

function Edit_FailDialog(msg){
  var text = msg;
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Fail');
}

function Section_generation_SuccessDialog(){
  var text = "Success!";
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Success');
}

function Section_generation_FailDialog(msg){
  var text = msg;
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Fail');
}

function Null_select_Dialog(){
  var text = "请选中相应部分进行修改";
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Fail');
}

function Reselect_Dialog(){
  var text = "请重新选择修改部分";
  var js = "<script>google.script.host.close();" + "alert('" + text + "');</script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, 'Fail');
}

