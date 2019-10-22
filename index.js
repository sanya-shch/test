// let matrix = [], M, N, X;
let meanValueInColumns = 0;
let tdsOnMouseOverSum;
let tdsOnMouseOver;
let mainTable = 0;

const fillingMatrix = ( matrix, M, N ) => {
    for (let i = 0; i < M; i++) {
        fillRow(matrix, N, i);
    }
};

const buildTable = (matrix, N, X) => {
    const table = document.createElement("table");
    table.className="main_table";
    const tbody = document.createElement("tbody");
    matrix.forEach((row, index) => {
        tbody.appendChild(buildRow(matrix, index, X));
    });

    // add the amount in columns
    const tr = document.createElement("tr");
    let td;
    for (let i = 0; i < matrix[0].length; i++) {
        td = document.createElement("td");
        td.className="amount_in_column";
        td.appendChild(document.createTextNode(meanValueInColumn(matrix, i)));
        tr.appendChild(td);
    }

    //add ADD btn
    td = document.createElement("td");
    td.className="add_row";
    td.appendChild(document.createTextNode('ADD'));
    td.onclick = () => onClickAddRow(matrix, N, X);
    tr.appendChild(td);

    tbody.appendChild(tr);
    table.appendChild(tbody);
    return table;
};

const buildRow = (matrix, index, X) => {
    const tr = document.createElement("tr");
    let td;
    const row = matrix[index];
    for (const el of row) {
        td = document.createElement("td");
        td.appendChild(document.createTextNode(el.Amount));
        td.setAttribute('id', `${el.ID}`);
        td.addEventListener("click", function () {onClickTd.call(this, matrix, row, el)});
        td.addEventListener("mouseover", function () {onMouseOverTd.call(this, matrix, X)});
        td.onmouseleave = onMouseLeaveTd;
        tr.appendChild(td);
    }

    // add the amount in row
    td = document.createElement("td");
    td.className = "amount_in_row";
    td.appendChild(document.createTextNode(sumInRow(row)));
    td.onmouseover = onMouseOverTdSum;
    td.onmouseleave = () => onMouseLeaveTdSum(row);
    tr.appendChild(td);

    td = document.createElement("td");
    td.appendChild(document.createTextNode('X'));
    td.className="remove_row";
    td.addEventListener("click", function () {onClickRemoveRow.call(this, matrix, td.parentNode.sectionRowIndex)});
    tr.appendChild(td);

    return tr;
};

const recountMeanValueInColumns = (matrix) => {
    if (!meanValueInColumns){
        meanValueInColumns = document.querySelector('.main_table tbody tr:last-child').querySelectorAll('td.amount_in_column');
    }
    for (let i = 0; i < meanValueInColumns.length; i++){
        meanValueInColumns[i].innerHTML = meanValueInColumn(matrix, i);
    }
};

const sumInRow = (row) => row.reduce((sum, current) => sum + current.Amount, 0);
const meanValueInColumn = (data, i) => Math.round(data.reduce((sum, current) => sum + current[i].Amount, 0) / data.length * 100) / 100;

const compereNumeric = (a,b) => {
    if(a.Amount > b.Amount)return 1;
    if(a.Amount < b.Amount)return -1;
};

const fillRow = (matrix, N, i = matrix.length) => {
    let id, amount;
    matrix[i] = [];
    for (let j = 0; j < N; j++) {
        id = `f${(Math.round(Math.random()*1e8)).toString(16)}`;
        amount = Math.round(Math.random() * 999);
        matrix[matrix.length-1][j] = {ID: id, Amount: amount};
    }
};

const onClickAddRow = (matrix, N, X) => {
    //add new row to matrix
    fillRow(matrix, N);

    if (!mainTable){
        mainTable = document.querySelector('.main_table tbody');
    }

    //add new row to dom
    const newTr = buildRow(matrix, matrix.length-1, X);
    mainTable.insertBefore(newTr, mainTable.querySelector('tr:last-child'));

    //recount mean value in columns
    recountMeanValueInColumns(matrix);
};

function onClickRemoveRow(matrix, index){
    //remove row
    this.parentElement.remove();

    matrix.splice(index,1);

    //recount mean value in columns
    recountMeanValueInColumns(matrix);
}

function onMouseOverTdSum(){
    tdsOnMouseOverSum = this.parentNode.querySelectorAll('td');
    for (let i = 0; i < tdsOnMouseOverSum.length-2; i++){
        const percent = Math.round(100 * Number(tdsOnMouseOverSum[i].innerHTML) / Number(this.innerHTML) * 100) / 100;
        tdsOnMouseOverSum[i].innerHTML = `${percent}%`;
        const span = document.createElement("span");
        span.className = 'sum_percent';
        span.style.height = `${percent}%`;
        tdsOnMouseOverSum[i].appendChild(span);
    }
}

const onMouseLeaveTdSum = (row) => {
    for (let i = 0; i < row.length; i++){
        tdsOnMouseOverSum[i].innerHTML = row[i].Amount;
    }
};

function onClickTd(matrix, row, el){
    el.Amount++;
    this.innerText = el.Amount;

    //recount sum in row
    this.parentElement.querySelector(`td:nth-child(${row.length+1})`).innerHTML = sumInRow(row);

    //recount mean value in columns
    recountMeanValueInColumns(matrix);
}

function onMouseOverTd(matrix, X){
    const result = []
        .concat(...matrix)
        .filter((el) => el.ID !== this.id)
        .map((arrEl) => {
            return {...arrEl, Amount: Math.abs(arrEl.Amount - this.innerHTML)}
        })
        .sort(compereNumeric)
        .slice(0, X);
    this.className = 'mouse_over_el';
    tdsOnMouseOver = [];
    let td;
    result.forEach((value, index) => {
        td = document.getElementById(`${value.ID}`);
        tdsOnMouseOver[index] = td;
        td.className = 'close_value';
    });
}

function onMouseLeaveTd(){
    this.classList.remove('mouse_over_el');
    for (let i = 0; i < tdsOnMouseOver.length; i++){
        tdsOnMouseOver[i].classList.remove('close_value');
    }
}

window.onload = () => {
    let matrix = [], M, N, X;

    do{
        M = Number(prompt("M - number of rows", '5'));
    }while (!isFinite(M) || M <= 0);
    do{
        N = Number(prompt("N - number of columns", '5'));
    }while (!isFinite(N) || N <= 0);
    do{
        X = Number(prompt("X", '5'));
    }while (!isFinite(X) || X < 0);

    fillingMatrix(matrix, M, N);

    document.querySelector('.wrap').appendChild(buildTable(matrix, N, X));
};
