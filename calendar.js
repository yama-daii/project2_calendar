let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// HTML要素の取得と初期化
function loadCalendar() {
  const calendarDays = document.querySelector("#calendar-days tbody");
  const currentMonthTitle = document.getElementById("current-month");
  calendarDays.innerHTML = "";
  currentMonthTitle.innerText = `${currentYear}年 ${currentMonth + 1}月`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let row = document.createElement("tr");

  // 月の最初の空のマス目を生成
  for (let i = 0; i < firstDay; i++) {
    row.innerHTML += `<td class="empty"></td>`;
  }

  // 1日から月末までの日付を生成
  for (let i = 1; i <= daysInMonth; i++) {
    if ((firstDay + i - 1) % 7 === 0 && i !== 1) {
      calendarDays.appendChild(row);
      row = document.createElement("tr");
    }
    row.innerHTML += `<td class="day" onclick="openModal(${i})">${i}</td>`;
  }

  // 最後の行を追加
  calendarDays.appendChild(row);
}

// 前月に移動
function prevMonth() {
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
  loadCalendar();
}

// 次月に移動
function nextMonth() {
  currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
  loadCalendar();
}

// イベント追加の呼び出し
function openModal(day) {
  document.getElementById("event-modal").style.display = "block";
  document.getElementById("event-name").dataset.day = day;
}

function closeModal() {
  document.getElementById("event-modal").style.display = "none";
}
function openlist() {
  document.getElementById("event-list").style.display = "block";
}
function closelist() {
  document.getElementById("event-list").style.display = "none";
}
// 日付のマス目をクリック時に予定を追加 + localStorageに保存 + 再読み込み
function addEvent() {
  const day = document.getElementById("event-name").dataset.day;
  const eventName = document.getElementById("event-name").value;
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  events.push({ year: currentYear, month: currentMonth, day: day, name: eventName });
  localStorage.setItem("events", JSON.stringify(events));
  loadCalendar();
  closeModal();
  displayevents();
}

// 登録されたイベント一覧の表示
function displayevents() {
  const eventlistelement = document.getElementById("showevents");
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  eventlistelement.innerHTML = "";
  events.forEach(event => {
    const listItem = document.createElement("li");
    listItem.textContent = `${event.year}/${event.month + 1}/${event.day} - ${event.name}`;
    eventlistelement.appendChild(listItem);
  });
}
// サイドバーのボタンに対応する関数
function openEventList() {
  alert('イベント一覧が表示されます');
  // イベント一覧を表示する処理
}


function openHelp() {
  alert('制作中');
  // ヘルプを表示する処理
}
//テーマに関する関数
function OpenThemeMenu() {
  document.getElementById("ThemeMenu").style.display = "block";
}
function CloseThemeMenu() {
  document.getElementById("ThemeMenu").style.display = "none";
}
function setTheme(theme) {
  document.body.className = theme + "-theme";
  localStorage.setItem("theme", theme);
}
// ページ読み込み時
document.addEventListener("DOMContentLoaded", function () {
  displayevents();
  loadCalendar();
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
});
