// --- 1. 資料區 ---
//課程名稱：
//離散數學、Python程式設計與人工智慧應用、作業系統概論、英文、國文、程式設計(二)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}
const scheduleData = [
  // 4月
  { date: "2026/04/11", course: "國文", todo: "習作一（飲食札記）", note: "" },
  { date: "2026/04/11", course: "程式設計(二)", todo: "上機考", note: "" },
  {
    date: "2026/04/16",
    course: "作業系統概論",
    todo: "期中考",
    note: "範圍：章節1、4、5、6",
  },
  { date: "2026/04/17", course: "英文", todo: "期中考", note: "範圍：單元7-9" },
  {
    date: "2026/04/22",
    course: "Python程式設計與人工智慧應用",
    todo: "期中考",
    note: "",
  },

  // 5月
  { date: "2026/05/16", course: "國文", todo: "分組報告", note: "" },
  { date: "2026/05/16", course: "程式設計(二)", todo: "上機考", note: "" },
  { date: "2026/05/22", course: "英文", todo: "口頭報告", note: "33-21號" },
  {
    date: "2026/05/23",
    course: "國文",
    todo: "分組報告、習作二（活動報導）",
    note: "",
  },
  { date: "2026/05/29", course: "英文", todo: "口頭報告", note: "20-1號" },
  { date: "2026/05/30", course: "國文", todo: "分組報告", note: "" },

  // 6月
  {
    date: "2026/06/10",
    course: "Python程式設計與人工智慧應用",
    todo: "期末考",
    note: "",
  },
  {
    date: "2026/06/11",
    course: "作業系統概論",
    todo: "期末考",
    note: "範圍：章節2、3、7、8",
  },
  {
    date: "2026/06/12",
    course: "英文",
    todo: "期末考",
    note: "範圍：單元10-12",
  },
  { date: "2026/06/13", course: "國文", todo: "期末考", note: "" },
  { date: "2026/06/13", course: "程式設計(二)", todo: "上機考", note: "" },
];

// --- 全域變數 ---
let currentMonthIndex = 0;
let uniqueMonths = [];
let isSearching = false;

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const monthDisplay = document.getElementById("monthDisplay");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const themeToggleBtn = document.getElementById("themeToggle");

// --- 2. 初始化邏輯 ---
function initApp() {
  const monthsSet = new Set();
  scheduleData.forEach((item) => {
    if (item.date && item.date.length >= 7) {
      monthsSet.add(item.date.substring(0, 7));
    }
  });
  uniqueMonths = Array.from(monthsSet).sort();

  if (uniqueMonths.length > 0) {
    currentMonthIndex = 0;
    renderMonthView();
  } else {
    renderTable([]);
    monthDisplay.textContent = "無資料";
    togglePagination(false);
  }
}

// --- 3. 深色模式切換邏輯 ---
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");

  if (currentTheme === "dark") {
    html.removeAttribute("data-theme");
    themeToggleBtn.textContent = "🌙 深色模式";
    localStorage.setItem("theme", "light"); // 儲存為淺色模式
  } else {
    html.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = "☀️ 亮色模式";
    localStorage.setItem("theme", "dark"); // 儲存為深色模式
  }
}

// --- 4. 渲染主邏輯 (分月) ---
function renderMonthView() {
  if (uniqueMonths.length === 0) return;

  const targetMonth = uniqueMonths[currentMonthIndex];

  // 修改：使用 parseInt 去除月份前面的 0 (例如 "02" -> 2)
  const monthNumber = parseInt(targetMonth.split("/")[1], 10);
  monthDisplay.textContent = monthNumber + "月";

  const monthlyData = scheduleData.filter((item) =>
    item.date.startsWith(targetMonth),
  );
  renderTable(monthlyData);

  prevBtn.disabled = currentMonthIndex === 0;
  nextBtn.disabled = currentMonthIndex === uniqueMonths.length - 1;

  togglePagination(true);
}

// --- 5. 渲染表格 HTML ---
function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="4" class="status-message">沒有找到資料</td></tr>';
    return;
  }

  data.forEach((item) => {
    const row = document.createElement("tr");

    // 修改：解析日期字串，去除月份的 0，組合成 M/DD 格式
    let displayDate = item.date;
    if (item.date && item.date.includes("/")) {
      const parts = item.date.split("/"); // ["2024", "02", "20"]
      if (parts.length >= 3) {
        displayDate = parseInt(parts[1], 10) + "/" + parts[2];
      }
    }

    row.innerHTML = `
                    <td>${displayDate}</td>
                    <td>${item.course}</td>
                    <td>${item.todo}</td>
                    <td>${item.note}</td>
                `;
    tableBody.appendChild(row);
  });
}

// --- 6. 切換月份 ---
function changeMonth(direction) {
  const newIndex = currentMonthIndex + direction;
  if (newIndex >= 0 && newIndex < uniqueMonths.length) {
    currentMonthIndex = newIndex;
    renderMonthView();
  }
}

// --- 7. 搜尋功能 ---
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase().trim();

  if (keyword === "") {
    isSearching = false;
    renderMonthView();
  } else {
    isSearching = true;
    togglePagination(false);
    //monthDisplay.parentElement.style.display = "flex";
    //monthDisplay.textContent = "搜尋結果";

    const filteredData = scheduleData.filter((item) => {
      return (
        (item.date && item.date.toLowerCase().includes(keyword)) ||
        (item.course && item.course.toLowerCase().includes(keyword)) ||
        (item.todo && item.todo.toLowerCase().includes(keyword)) ||
        (item.note && item.note.toLowerCase().includes(keyword))
      );
    });

    renderTable(filteredData);
  }
});

function togglePagination(show) {
  const displayStyle = show ? "flex" : "none";
  const controls = document.getElementById("paginationControls");
  if (controls) controls.style.display = displayStyle;
}
// --- 8. 鍵盤左右鍵切換月份功能 ---
document.addEventListener("keydown", (e) => {
  // 檢查 1：如果目前正在搜尋模式，不觸發切換
  // 檢查 2：如果使用者的游標正在搜尋框裡面打字，不觸發切換
  if (isSearching || document.activeElement === searchInput) {
    return;
  }

  if (e.key === "ArrowLeft") {
    // 按下左鍵，且「上個月」按鈕不是反灰狀態時
    if (!prevBtn.disabled) {
      changeMonth(-1);
    }
  } else if (e.key === "ArrowRight") {
    // 按下右鍵，且「下個月」按鈕不是反灰狀態時
    if (!nextBtn.disabled) {
      changeMonth(1);
    }
  }
});

initApp();
