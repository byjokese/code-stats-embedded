const LEVEL_FACTOR = 0.025;
/**
 * [getLevel Get Level Number from experience quantity]
 * @param  {[Number]} xp [total experience]
 * @return {[Number]} [description]
 */
function getLevel(xp) {
  return Math.floor(Math.sqrt(xp) * LEVEL_FACTOR);
}
/**
 * [getNextLevelXp Get the experience needed for next level]
 * @param  {[Number]} level [Current Level]
 * @return {[Number]} [Experience of next level]
 */
function getNextLevelXp(level) {
  return Math.ceil((level + 1) / LEVEL_FACTOR) ** 2;
}
/**
 * [getLevelProgress Get the progress of current level in (0-100)%]
 * @param  {[Number]} xp [Experience]
 * @return {[Number]} [Level progress in (0-100)%]
 */
function getLevelProgress(xp) {
  const level = getLevel(xp);
  const current_level_xp = getNextLevelXp(level - 1);
  const next_level_xp = getNextLevelXp(level);
  const have_xp = xp - current_level_xp;
  const needed_xp = next_level_xp - current_level_xp;

  return Math.round((have_xp / needed_xp) * 100);
}
/**
 * [formatNumber Formats the num with proper commas]
 * @param  {[Number]} num [Number to format]
 * @return {[String]} [formated number]
 */
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
/**
 * [processMonthNumbers Changes Month number into Month Names (3 first letter of the month)]
 * @param  {[String]} monthNumbers [Array of month numbers]
 * @return {[String]} [array containing all month names]
 */
function processMonthNumbers(monthNumbers) {
  var monthsNames = [];
  for (var i in monthNumbers) {
    switch (monthNumbers[i]) {
      case "01":
        monthsNames.push("Jan");
        break;
      case "02":
        monthsNames.push("Feb");
        break;
      case "03":
        monthsNames.push("Mar");
        break;
      case "04":
        monthsNames.push("Apr");
        break;
      case "05":
        monthsNames.push("May");
        break;
      case "06":
        monthsNames.push("Jun");
        break;
      case "07":
        monthsNames.push("Jul");
        break;
      case "08":
        monthsNames.push("Aug");
        break;
      case "09":
        monthsNames.push("Sep");
        break;
      case "10":
        monthsNames.push("Oct");
        break;
      case "11":
        monthsNames.push("Nov");
        break;
      case "12":
        monthsNames.push("Dec");
        break;
    }
  }
  return monthsNames;
}
/**
 * [setupLanguages Sets the HTML with the data loaded from param]
 * @param  {[JSON]} languages [Array containing language and experience]
 */
function setupLanguages(languages) {
  languages = languages.slice(0, 5);
  var i;
  for (i = 0; i < languages.length; i++) {
    var progress = getLevelProgress(languages[i]["content"]["xps"]);
    var combinedLevelProgress = $("<div></div>")
      .addClass("combined-level-progress")
      .appendTo(".top-languages");
    var hTitle = $("<h4></h4>")
      .addClass("level-counter")
      .appendTo(combinedLevelProgress);
    $("<strong></strong>")
      .html(languages[i]["name"])
      .addClass("level-prefix")
      .appendTo(hTitle);
    $("<span></span>")
      .html(" Level " + getLevel(languages[i]["content"]["xps"]) + " (" + formatNumber(languages[i]["content"]["xps"]) + ")")
      .addClass("total-xp")
      .appendTo(hTitle);
    $("<span></span>")
      .html(" (+" + formatNumber(languages[i]["content"]["new_xps"]) + ")")
      .addClass("recent-xp")
      .appendTo(hTitle);
    var progressBar = $("<div></div>")
      .addClass("progress-bar")
      .appendTo(combinedLevelProgress);
    $("<span></span>")
      .attr("role", "progressbar")
      .attr("aria-valuetext", "Level progress " + progress + "%.")
      .css("width", progress + "%")
      .addClass("progress progress-old")
      .appendTo(progressBar);
    /*$("<span></span>")
        .attr("role", "progressbar")
        .attr("aria-valuetext", "Recent level progress " + newProgress + "%.")
        .css("width", newProgress + "%")
        .addClass("progress progress-recent")
        .appendTo(progressBar);*/
    $("<span></span>")
      .attr("aria-hidden", true)
      .html(progress + "&nbsp;%")
      .addClass("total-progress")
      .appendTo(progressBar);
  }
}
/**
 * [setupDates Sets the HTML with the data loaded from param]
 * @param  {[JSON]} dates [Array containing dates and experience]
 */
function setupDates(dates) {
  var lastMonth = dates[dates.length - 1]["date"].slice(5, 7);
  function findFirstMonth(element) {
    return element["date"].slice(5, 7) > lastMonth;
  }
  var indexFirstMonth = dates.findIndex(findFirstMonth);
  dates = dates.slice(indexFirstMonth, dates.length - 1);
  //Calculate the total for each month
  var monthValues = [];
  var monthNumbers = [];
  var previusMonth = dates[0]["date"].slice(5, 7);
  var monthTotal = 0;
  var i;
  for (i = 0; i < dates.length; i++) {
    var currentMonth = dates[i]["date"].slice(5, 7);
    if (previusMonth === currentMonth) {
      monthTotal += dates[i]["value"];
    } else {
      monthValues.push(monthTotal);
      monthNumbers.push(previusMonth);
      previusMonth = currentMonth;
      monthTotal = dates[i]["value"];
    }
  }
  monthValues.push(monthTotal);
  monthNumbers.push(previusMonth);
  //Proccess Months Names
  var monthLabels = processMonthNumbers(monthNumbers);
  new Chart($("#myChart"), {
    type: "line",
    data: {
      labels: monthLabels,
      datasets: [
        {
          data: monthValues,
          label: "XP",
          borderColor: "#3e95cd",
          fill: true
        }
      ]
    }
  });
}
/**
 * [loadData Retrieves the data from Codes::Stats API for inserted username]
 * @param  {[String]} username [username from Codes::Stats (codestats.net)]
 */
function loadData(username) {
  $.getJSON("https://codestats.net/api/users/" + username, function(data) {
    //User Name
    $("<small>Summary of experience and top languages for <a href='https://codestats.net/users/" + data["user"] + "' target='blank'>@" + data["user"] + "</a></small>")
      .addClass("dataOf")
      .appendTo(".bottom-container");
    //Proccess Data from languages
    var languages = [];
    for (var key in data["languages"]) {
      languages.push({ name: key, content: data["languages"][key] });
    }
    languages.sort(function(a, b) {
      return b["content"]["xps"] > a["content"]["xps"] ? 1 : b["content"]["xps"] < a["content"]["xps"] ? -1 : 0;
    });
    setupLanguages(languages);
    //Procress Data from dates
    var dates = [];
    for (var date in data["dates"]) {
      dates.push({ date: date, value: data["dates"][date] });
    }
    dates.sort(function(a, b) {
      return b["date"] < a["date"] ? 1 : b["date"] > a["date"] ? -1 : 0;
    });
    //Trim dates to just last year
    setupDates(dates);
  });
}
/**
 * [CodeStatsEmbed RMain function that setups the widget to show on specified parameters]
 * @param  {[String]} container [selector of desired container to insert the widget on]
 * @param  {[String]} username [username from Codes::Stats (codestats.net)]
 */
function CodeStatsEmbed(container, username) {
  $("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js"></script>');
  var embedded = $("<div></div>")
    .attr("id", "codestatsembedded")
    .appendTo(container);
  var topContainer = $("<div></div>")
    .addClass("top-container")
    .appendTo(embedded);
  var bottomContainer = $("<div></div>")
    .addClass("bottom-container")
    .appendTo(embedded);

  $(
    '<small>📄 Stats retrived from <a href="https://codestats.net">codestats.net</a> using 💻 <a href="https://github.com/byjokese/code-stats-embeded">code-stats-embeded</a> by <a href="https://byjokese.com">@byjokese</a></small>'
  ).appendTo(bottomContainer);

  var columLeft = $("<div></div>").addClass("codestats-colum-left");
  columLeft.appendTo(topContainer);
  var separator = $("<div></div>").addClass("separator");
  separator.appendTo(topContainer);
  var columRight = $("<div></div>").addClass("codestats-colum-right");
  columRight.appendTo(topContainer);
  //Left Side
  $("<h2>Last year Experience</h2>")
    .addClass("column-title")
    .appendTo(columLeft);
  $("<canvas id='myChart' width='100%' height='60'></canvas>").appendTo(columLeft);

  //Right Side
  $("<h2>Top Languages</h2>")
    .addClass("column-title")
    .appendTo(columRight);
  var topLanguages = $("<div></div>")
    .addClass("top-languages")
    .appendTo(columRight);

  loadData(username);
}
