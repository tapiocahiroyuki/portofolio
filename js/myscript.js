  // カスタマイズ

//期間の算出
$('.duration').each(function(){
var startTime = new Date($(this).find('time.start').attr('datetime'));
console.log("StartTime:" + startTime);
var endTime = new Date($(this).find('time.end').attr('datetime'));
console.log("EndTime:" + endTime);
var duration = (endTime.getFullYear() * 12 + endTime.getMonth()) - (startTime.getFullYear() * 12 + startTime.getMonth());
var durYear = Math.floor(duration / 12);
var durMonth = duration % 12;
if (!isNaN(durYear)) {
console.log(durYear + "年" + durMonth + "ヶ月");
$(this).append("（" + durYear + "年" + durMonth + "ヶ月" + "）");
}
});

//ラジオボタンの状態を確認



//西暦を和暦に置き換え
function japaneseCalendar(){
$('time').each(function(){
var nengo = new Array(
['明治',1912,07,30],
['大正',1926,12,24],
['昭和',1989,01,06],
['平成',2019,04,30],
['未定',2099,12,31]
);

var adTime = new Date($(this).attr('datetime'));

var y = "";
var ng = "";
for(i=1; i<nengo.length; i++){
var gannen = nengo[i];
var prevGannen = nengo[i-1];
y = ((adTime.getFullYear() === prevGannen[1]) ? '元' : (adTime.getFullYear() - prevGannen[1] + 1));
ng = gannen[0];
if (adTime.getFullYear() <  gannen[1]) {
  break;
} else if (adTime.getFullYear() === gannen[1]) {
  if ((adTime.getMonth() + 1) < gannen[2]) {
    break;
  } else if ((adTime.getMonth() + 1) === gannen[2]) {
    if (adTime.getDay() < gannen[3]){
      break;
    }
  }

}
}

var d = ($(this).hasClass('withDate')) ? (adTime.getUTCDate() + "日") : "";
$(this).html(ng + y + "年" + (adTime.getMonth() + 1) + "月" + d);
});
}

//和暦を西暦に戻す
function gregorianCalendar(){
$('time').each(function(){

var adTime = new Date($(this).attr('datetime'));
var y = adTime.getFullYear();
var d = ($(this).hasClass('withDate')) ? (adTime.getUTCDate() + "日") : "";
$(this).html(y + "年" + (adTime.getMonth() + 1) + "月" + d);
});
}


//ラジオボタンを押した時
$('#jc').bind('change',function(){
  $.cookie( "calendar" , "jc" , { expires: 7 , path: "/"});
  japaneseCalendar();
});
$('#gc').bind('change',function(){
  $.cookie( "calendar" , "gc" , { expires: 7 , path: "/"});
  gregorianCalendar();
});

//最初の読み込み時
if ($.cookie( "calendar" ) === "gc"){
  $('#gc').prop('checked',true);
  gregorianCalendar();
} else {
  japaneseCalendar();
}

$('.recentUpdated ol li time').each(function(){
  var adTime = new Date($(this).attr('datetime'));
  var now = Date.now();
  if((now - adTime) > 1000 * 60 * 60 * 24 * 30){$(this).parent().parent().remove();}
});

if (($('.recentUpdated ol li').length) === 0) {$('.recentUpdated').html('<h4>最新更新の記事</h4>\n<p>30日間に変更された記事はありません</p>');}
