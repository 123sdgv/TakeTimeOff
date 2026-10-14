const STORAGE_KEY_COUNT = 'jiatiao_sim_count';
const STORAGE_KEY_TIMESTAMP = 'jiatiao_sim_last_week_ts';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数

const counterEl = document.getElementById('counter');
const btnPlus = document.getElementById('btn-plus');
const btnMinus = document.getElementById('btn-minus');
const timeEl = document.getElementById('current-time');

// 1. 初始化读取数据与计算每周自动+2
function initSimulator() {
    let count = localStorage.getItem(STORAGE_KEY_COUNT);
    let lastTimestamp = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
    const now = Date.now();

    // 第一次打开时初始化
    if (count === null || lastTimestamp === null) {
        count = 0;
        lastTimestamp = now;
        localStorage.setItem(STORAGE_KEY_COUNT, count);
        localStorage.setItem(STORAGE_KEY_TIMESTAMP, lastTimestamp);
    } else {
        count = parseInt(count, 10);
        lastTimestamp = parseInt(lastTimestamp, 10);

        // 计算距离上次结算过去了几个完整周
        const elapsedMs = now - lastTimestamp;
        if (elapsedMs >= ONE_WEEK_MS) {
            const weeksPassed = Math.floor(elapsedMs / ONE_WEEK_MS);
            count += weeksPassed * 2; // 每满一周自动 +2
            // 推进结算时间戳（保留余数天数，不会吞掉不足一周的时间）
            lastTimestamp += weeksPassed * ONE_WEEK_MS;

            localStorage.setItem(STORAGE_KEY_COUNT, count);
            localStorage.setItem(STORAGE_KEY_TIMESTAMP, lastTimestamp);
        }
    }

    counterEl.textContent = count;
}

// 2. 更新数字并保存到本地
function changeCount(delta) {
    let current = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);
    current += delta;
    localStorage.setItem(STORAGE_KEY_COUNT, current);
    counterEl.textContent = current;
}

// 3. 绑定加减号按钮
btnPlus.addEventListener('click', () => changeCount(1));
btnMinus.addEventListener('click', () => changeCount(-1));

// 4. 底部状态栏实时显示时间，并顺带检测是否跨周
function updateClock() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    timeEl.textContent = `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
    initSimulator();
}

// 启动运行
initSimulator();
updateClock();
setInterval(updateClock, 1000);
