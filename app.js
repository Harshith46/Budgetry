const BudgetController = (() => {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: 0,
  };

  const calculateTotal = type => {
    const getTotalValue = data.allItems[type].map(item => item.value);
    data.totals[type] = getTotalValue.reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  };

  return {
    addItem: (type, description, value) => {
      const id =
        data.allItems[type].length > 0
          ? data.allItems[type][data.allItems[type].length - 1].id + 1
          : 0;
      const newItem =
        type === 'inc'
          ? new Income(id, description, value)
          : new Expense(id, description, value);
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculate: () => {
      calculateTotal('inc');
      calculateTotal('exp');
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },
    getBudget: () => {
      return {
        budget: data.budget,
        income: data.totals.inc,
        expense: data.totals.exp,
        percentage: data.percentage,
      };
    },
  };
})();

const UIController = (() => {
  return {
    getInput: () => ({
      type: document.querySelector('.add__type').value,
      description: document.querySelector('.add__description').value,
      value: parseFloat(document.querySelector('.add__value').value),
    }),
    addListItem: (obj, type) => {
      const html =
        type === 'inc'
          ? `<div class="item clearfix" id=${obj.id}><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">+ ${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
          : `<div class="item clearfix" id=${obj.id}><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">- ${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

      const listElement =
        type === 'inc'
          ? document.querySelector('.income__list')
          : document.querySelector('.expenses__list');

      listElement.insertAdjacentHTML('beforeend', html);
    },
    clearValue: () => {
      const getValueElements = document.querySelectorAll(
        '.add__description, .add__value'
      );
      getValueElements.forEach(item => (item.value = ''));
      getValueElements[0].focus();
    },
    getBudget: obj => {
      const TotalBudget = () => {
        if (obj.income === obj.expense || !obj.budget) {
          return 0;
        } else if (obj.income < obj.expense) {
          return '- ' + obj.budget;
        } else return '+ ' + obj.budget;
      };
      document.querySelector('.budget__value').textContent = TotalBudget();
      document.querySelector('.budget__income--value').textContent =
        '+ ' + obj.income;
      document.querySelector('.budget__expenses--value').textContent =
        '- ' + obj.expense;
      document.querySelector('.budget__expenses--percentage').textContent =
        obj.percentage + ' %';
    },
  };
})();

const Controller = ((BudgetController, UIController) => {
  const getEventListeners = () => {
    document
      .querySelector('.add__btn')
      .addEventListener('click', controlAddItem);
    document.addEventListener('keypress', e => {
      e.keyCode === 13 && controlAddItem();
    });
  };
  const UpdateBudget = () => {
    BudgetController.calculate();
    UIController.getBudget(BudgetController.getBudget());
  };
  const controlAddItem = () => {
    const inputValue = UIController.getInput(); //get input value
    if (inputValue.value && inputValue.description) {
      const updateDataStructure = BudgetController.addItem(
        inputValue.type,
        inputValue.description,
        inputValue.value
      );

      UIController.addListItem(updateDataStructure, inputValue.type);
      UpdateBudget();
      UIController.clearValue();
    }
  };

  return {
    init: () => {
      getEventListeners();
    },
  };
})(BudgetController, UIController);

Controller.init();
