let data = [];
const rowsPerPage = 20;
let currentPage = 1;

// 从 JSON 文件加载数据
async function loadData() {
    try {
        const response = await fetch('data.json');
        const jsonData = await response.json();
        data = jsonData;
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

function formatCount(count) {
    if (count >= 1e9) {
        return (count / 1e9).toFixed(1) + 'B';
    } else if (count >= 1e6) {
        return (count / 1e6).toFixed(1) + 'M';
    } else if (count >= 1e3) {
        return (count / 1e3).toFixed(1) + 'K';
    }
    return count;
}

function getRankHTML(index) {
    const rank = index + 1;
    if (rank <= 3) {
        return `<div class="rank-${rank}">${rank}</div>`;
    }
    return `<div class="rank">${rank}</div>`;
}

function renderTable() {
    const tableBody = document.querySelector('#navTable tbody');
    tableBody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach((item, index) => {
        const absoluteIndex = start + index;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${getRankHTML(absoluteIndex)}</td>
            <td class="tool-name">${item.website_name}</td>
            <td><a href="${item.website}" target="_blank">${item.website}</a></td>
            <td>${item.payment_platform.join(', ')}</td>
            <td>${formatCount(item.month_visited_count)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // 添加上一页按钮
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '上一页';
    prevButton.classList.add('prev-next');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            renderPagination();
        }
    });
    pagination.appendChild(prevButton);

    // 添加页码按钮
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            const button = document.createElement('button');
            button.textContent = i;
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                renderTable();
                renderPagination();
            });
            pagination.appendChild(button);
        } else if (
            i === currentPage - 2 ||
            i === currentPage + 2
        ) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'ellipsis';
            pagination.appendChild(ellipsis);
        }
    }

    // 添加下一页按钮
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '下一页';
    nextButton.classList.add('prev-next');
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            renderPagination();
        }
    });
    pagination.appendChild(nextButton);
}

// 页面加载时获取数据
loadData();