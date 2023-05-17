function createNewTrigger() {
  var trigger = ScriptApp.newTrigger('update')
      .timeBased()
      .everyMinutes(1) // 设置每分钟运行一次
      .create();
}

function update() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  // 模拟每秒钟运行一次
  for (var i = 0; i < 60; i++) {
    var outline = "";
    var section = "";
    var paragraphs = body.getParagraphs();
    for(var j = 0; j < paragraphs.length; j++){
      if(paragraphs[j].getFontSize() == 15){
        outline += paragraphs[j].getText();
        outline += '\n';
      }
    }
    for(var j = 0; j < paragraphs.length; j++){
      if(paragraphs[j].getFontSize() == 12 && j != 3){
        section += paragraphs[j].getText();
      }
    }
    PropertiesService.getScriptProperties().setProperties(
      {
        'title':paragraphs[1].getText().toString(),
        'abstract':paragraphs[3].getText().toString(),
        'outline':outline.toString(),
        'section':section.toString(),
      }
    );
    Utilities.sleep(1000); // 休眠 1 秒钟
  }
}
