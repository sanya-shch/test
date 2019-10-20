let matrix = [], M, N, X;

const fillingMatrix = () => {
    for (let i = 0; i < M; i++) {
        matrix[i] = [];
        for (let j = 0; j < N; j++) {
            const id = `f${(Math.round(Math.random()*1e8)).toString(16)}`;
            const amount = Math.round(Math.random() * 999);
            matrix[i][j] = {ID: id, Amount: amount};
        }
    }
};

const buildTable = (data) => {
    const table = document.createElement("table");
    table.className="main_table";
    const tbody = document.createElement("tbody");
    data.forEach((row) => {
        tbody.appendChild(buildRow(row));
    });

    // add the amount in columns
    const tr = document.createElement("tr");
    for (let i = 0; i < data[0].length; i++) {
        const td = document.createElement("td");
        td.className="amount_in_column";
        td.appendChild(document.createTextNode(meanValueInColumn(data, i)));
        tr.appendChild(td);
    }
    tbody.appendChild(tr);

    table.appendChild(tbody);
    return table;
};

const buildActionsTable = (data) => {
    const table = document.createElement("table");
    table.className="action_table";
    const tbody = document.createElement("tbody");

    //add REMOVE btn
    for (let i = 0; i < data.length; i++){
        tbody.appendChild(removeBtn(i));
    }

    //add ADD btn
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.className="add_row";
    td.appendChild(document.createTextNode('ADD'));
    td.onclick = () => {
        //add new row to matrix
        M++;
        matrix[matrix.length] = [];
        for (let j = 0; j < N; j++) {
            const id = `f${(Math.round(Math.random()*1e8)).toString(16)}`;
            const amount = Math.round(Math.random() * 999);
            matrix[matrix.length-1][j] = {ID: id, Amount: amount};
        }

        const table = document.querySelector('.main_table tbody');

        //add new row to dom
        const newTr = buildRow(matrix[matrix.length-1]);
        table.insertBefore(newTr, table.querySelector('tr:last-child'));

        //recount mean value in columns
        recountMeanValueInColumns(table);

        //add remove btn
        const aTable = document.querySelector('.action_table tbody');
        aTable.insertBefore(removeBtn(matrix.length-1), aTable.querySelector('tr:last-child'));
    };
    tr.appendChild(td);
    tbody.appendChild(tr);
    table.appendChild(tbody);
    return table;
};

const buildRow = (row) => {
    const tr = document.createElement("tr");
    let result;
    for (const el of row) {
        const td = document.createElement("td");
        td.appendChild(document.createTextNode(el.Amount));
        td.setAttribute('id', `${el.ID}`);
        td.onclick = () => {
            el.Amount++;

            const newTd = document.getElementById(`${el.ID}`);
            newTd.innerText = el.Amount;

            //recount sum in row
            newTd.parentElement.querySelector(`td:last-child`).innerHTML = sumInRow(row);

            //recount mean value in columns
            recountMeanValueInColumns(document.querySelector('.main_table tbody'));
        };
        td.onmouseover = () => {
            result = [].concat(...matrix).filter((el) => el.ID !== td.id).map((arrEl) => {return {...arrEl, Amount: Math.abs(arrEl.Amount - td.innerHTML)}}).sort(compereNumeric);
            td.className = 'mouse_over_el';
            for (let i = 0; i < X; i++){
                document.getElementById(`${result[i].ID}`).className = 'close_value';
            }
        };
        td.onmouseleave = () => {
            td.classList.remove('mouse_over_el');
            for (let i = 0; i < X; i++){
                document.getElementById(`${result[i].ID}`).classList.remove('close_value');
            }
        };
        tr.appendChild(td);
    }

    // add the amount in row
    const td = document.createElement("td");
    td.className = "amount_in_row";
    td.appendChild(document.createTextNode(sumInRow(row)));
    td.onmouseover = () => {
        const tds = td.parentNode.querySelectorAll('td');
        for (let i = 0; i < N; i++){
            const percent = Math.round(100 * Number(tds[i].innerHTML) / Number(td.innerHTML) * 100) / 100;
            tds[i].innerHTML = `${percent}%`;
            const span = document.createElement("span");
            span.className = 'sum_percent';
            span.style.height = `${percent}%`;
            tds[i].appendChild(span);
        }
    };
    td.onmouseleave = () => {
        const tds = td.parentNode.querySelectorAll('td');
        for (let i = 0; i < N; i++){
            tds[i].innerHTML = row[i].Amount;
        }
    };
    tr.appendChild(td);
    return tr;
};

const removeBtn = (i) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.appendChild(document.createTextNode('X'));
    td.className="remove_row";
    td.onclick = () => {
        //remove row
        const table = document.querySelector('.main_table tbody');
        table.querySelector(`tr:nth-child(${i+1})`).remove();

        //remove REMOVE btn
        document.querySelector('.action_table').remove();
        matrix.splice(i,1);
        document.querySelector('.wrap').appendChild(buildActionsTable(matrix));

        //recount mean value in columns
        recountMeanValueInColumns(table);
    };
    tr.appendChild(td);

    return tr;
};

const recountMeanValueInColumns = (table) => {
    const lastTr = table.querySelector('tr:last-child');
    const tds = lastTr.querySelectorAll('td');
    for (let i = 0; i < N; i++){
        tds[i].innerHTML = meanValueInColumn(matrix, i);
    }
};

const sumInRow = (row) => row.reduce((sum, current) => sum + current.Amount, 0);
const meanValueInColumn = (data, i) => Math.round(data.reduce((sum, current) => sum + current[i].Amount, 0) / data.length * 100) / 100;

const compereNumeric = (a,b) => {
    if(a.Amount > b.Amount)return 1;
    if(a.Amount < b.Amount)return -1;
};

window.onload = () => {
    do{
        M = Number(prompt("M - number of rows", '5'));
    }while (!isFinite(M) || M <= 0);
    do{
        N = Number(prompt("N - number of columns", '5'));
    }while (!isFinite(N) || N <= 0);
    do{
        X = Number(prompt("X", '5'));
    }while (!isFinite(X) || X < 0);

    fillingMatrix();

    document.querySelector('.wrap').appendChild(buildTable(matrix));
    document.querySelector('.wrap').appendChild(buildActionsTable(matrix));
};
