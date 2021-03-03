const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}

const transaction = [
    {
        description: 'Criação de aplicação',
        amount: 400000,
        date: '14/01/2021',
    },
    {
        description: 'Energia Elétrica',
        amount: -21052,
        date: '15/01/2021',
    },
    {
        description: 'Água do mês',
        amount: -12012,
        date: '15/01/2021',
    },
    {
        description: 'Telefone',
        amount: -23092,
        date: '15/01/2021',
    },
    {
        description: 'Lanche',
        amount: -5599,
        date: '17/01/2021',
    },
    {
        description: 'Viagem dos Sonhos',
        amount: -118245,
        date: '19/01/2021',
    },
    {
        description: 'Bolsa PROAE',
        amount: 40000,
        date: '03/02/2021',
    },
]

const Transaction = {
    all: transaction,
    // Adiciona transação
    add(t) {
        Transaction.all.push(t);
        App.reload();
    },
    // Somar todos os intens de entrada
    incomes() {
        let income = 0;
        Transaction.all.forEach(element => {
            if (element.amount > 0){
                income += element.amount;
            }
        });

        return income;
    },
    //Soma todaas os itens de saída
    expenses() {
        let expenses = 0;
        Transaction.all.forEach(element => {
            if (element.amount < 0){
                expenses += element.amount;
            }
        });

        return expenses;
    },
    //soma total, relizada entre entradas e saídas
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

//estrutura html para inserção
const elementoHTML = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction) {
        const tr = document.createElement('tr');
        tr.innerHTML = elementoHTML.innerHTMLTransaction(transaction);
        elementoHTML.transactionsContainer.appendChild(tr);
    },
    removeTrasaction(index){
        Transaction.all.splice(index, 1);
    },
    innerHTMLTransaction(transaction) {
        const CSSClass = transaction.amount > 0 ? "gain" : "spent";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `<td class="description">${transaction.description}</td>
        <td class="${CSSClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><i class="bi-dash-circle" alt="imagem de remoção de transação"></i></td>`;

        return html;
    },
    updateBalance() {
        document.getElementById('entradas').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('saidas').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('total').innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearDisplay(){
        elementoHTML.transactionsContainer.innerHTML = "";
    }
};

const Utils = {
    formatAmount(value) {
         value = Number(value) * 100;

         return value;
    },
    formatDate(date) {
        const splited = date.split("-");
        return `${splited[2]}/${splited[1]}/${splited[0]}`;
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        //value = value * 100;

        value = signal + value;

        return value;
    }
}

const form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value
        };
    },
    formatValues() {
        let { description, amount, date } = form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        console.log(description);
        console.log(amount);
        console.log(date);

        return {
            description,
            amount,
            date
        }
    },
    saveTransaction(transact) {
        Transaction.add(transact);
    },
    clearFields() {
        form.description.value = "";
        form.amount.value = "";
        form.date.value = "";
    },
    validateFields() {
        const { description, amount, date } = form.getValues();

        return description != "" || amount != "" || date != "" ? true : false;
    },
    submit(event) {
        event.preventDefault();
        if (!form.validateFields()) return;
        const transact = form.formatValues();
        form.saveTransaction(transact);
        form.clearFields();
        Modal.close();
        console.log(event);
    }
};

const App = {
    init() {
        Transaction.all.forEach(element => {
            elementoHTML.addTransaction(element);
        });

        elementoHTML.updateBalance();
    },
    reload() {
        elementoHTML.clearDisplay();
        App.init();
    },
}

App.init();

//Parei em 2:08:00