let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// HTML要素の取得と初期化
function loadCalendar() {
  const calendarDays = document.querySelector("#calendar-days tbody");
  const currentMonthTitle = document.getElementById("current-month");
  calendarDays.innerHTML = "";
  currentMonthTitle.innerText = `${currentYear}年 ${currentMonth + 1}月`;

  const events =JSON.parse(localStorage.getItem("events")||"[]");

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let row = document.createElement("tr");

  // 月の最初の空のマス目を生成
  for (let i = 0; i < firstDay; i++) {
    row.innerHTML += `<td class="empty"></td>`;
  }

  // 1日から月末までの日付を生成・イベントがあるならマス目上に表示させる
  for (let i = 1; i <= daysInMonth; i++) {
    if ((firstDay + i - 1) % 7 === 0 && i !== 1) {
      calendarDays.appendChild(row);
      row = document.createElement("tr");
    }
    const eventForDay = events.filter(
      (event) => 
        event.year === currentYear && 
        event.month === currentMonth && 
        event.day == i
    );
    let eventHTML = "";
    if (eventForDay.length > 0) {
      eventForDay.forEach((event) => {
        eventHTML += `<div class="event">${event.name}</div>`;
      });
    }

    row.innerHTML += `<td class="day" onclick="openModal(${i})">${i}${eventHTML}</td>`;
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
  document.getElementById("event-name").value = "";
}
// 日付のマス目をクリック時に予定を追加 + localStorageに保存 + 再読み込み
function addEvent() {
  const day = document.getElementById("event-name").dataset.day;
  const eventName = document.getElementById("event-name").value;
  if (!eventName) {
    alert("イベント名を入力してください。");
    return; // 処理を中断
  }
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  events.push({ year: currentYear, month: currentMonth, day: day, name: eventName });
  localStorage.setItem("events", JSON.stringify(events));
  loadCalendar();
  closeModal();
  displayevents();

  document.getElementById("event-name").value="";
  document.getElementById("event-date").value="";
}
  function editEvent(index) {
    closelist();
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const event = events[index];
    
    // 編集モーダルにイベントの情報をセット
    document.getElementById("edit-event-name").value = event.name;
    
    // インデックスをデータ属性として保存
    const eventDayElement = document.getElementById("edit-event-day");
    
    if (eventDayElement) {
      eventDayElement.dataset.index = index; // 編集対象のインデックスを保存
    } else {
      console.error("edit-event-day element not found");
    }
    
    // 編集モーダルを表示
    document.getElementById("edit-modal").style.display = "block";
  }

  function saveEdit() {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const index = document.getElementById("edit-event-day").dataset.index;  // 編集対象のインデックスを取得
    const newEventName = document.getElementById("edit-event-name").value;
  
    if (!newEventName) {
      alert("イベント名を入力してください。");
      return;
    }
  
    events[index].name = newEventName; // イベント名を更新
    localStorage.setItem("events", JSON.stringify(events));
    
    loadCalendar(); // カレンダーを再描画
    displayevents(); // イベントリストを再描画
    document.getElementById("edit-event-name").value = "";
    closeEditModal(); // 編集モーダルを閉じる
  }
  
function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
}
function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  events.splice(index, 1); // Remove the event
  localStorage.setItem("events", JSON.stringify(events));
  
  loadCalendar(); // Reload the calendar to reflect the changes
  displayevents(); // Update the event list
}




// 登録されたイベント一覧の表示
function displayevents() {
  const eventlistelement = document.getElementById("showevents");
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  eventlistelement.innerHTML = "";
  events.forEach((event, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${event.year}/${event.month + 1}/${event.day} - ${event.name} 
      <button onclick="editEvent(${index})">編集</button>
      <button onclick="deleteEvent(${index})">削除</button>`;
    eventlistelement.appendChild(listItem);
  });
}


// サイドバーのボタンに対応する関数
//イベント一覧の切り替え
function openlist() {
  document.getElementById("event-list").style.display = "block";
}
function closelist() {
  document.getElementById("event-list").style.display = "none";
}
//ヘルプの一覧を表示(実装するか未定)
function openHelp() {
  alert('制作中');

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

