document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('metricsChart').getContext('2d');
    let metricsChart;

    const inputs = {
        periods: document.getElementById('periods'),
        launchingCustomers: document.getElementById('launching-customers'),
        revenuePerConversion: document.getElementById('revenue-per-conversion'),
        customerGrowthRate: document.getElementById('customer-growth-rate'),
        averageResponseRate: document.getElementById('average-response-rate'),
        customerChurnRate: document.getElementById('customer-churn-rate'),
        variableCost: document.getElementById('variable-cost'),
        fixedCosts: document.getElementById('fixed-costs'),
        startingCost: document.getElementById('starting-cost'),
    };

    const summary = {
        profitableWeek: document.getElementById('profitable-week'),
        summaryWeek: document.getElementById('summary-week'),
        customers: document.getElementById('summary-customers'),
        revenue: document.getElementById('summary-revenue'),
        expenses: document.getElementById('summary-expenses'),
        profit: document.getElementById('summary-profit'),
        retention: document.getElementById('summary-retention'),
        roi: document.getElementById('summary-roi'),
    };

    const translations = {
        'english': {
            'title': 'RESULTSPREDICTOR',
            'subtitle': 'EMAIL CAMPAIGN',
            'language': 'Language',
            'time_unit': 'Time Unit',
            'week': 'Week',
            'periods': 'Number of Periods',
            'currency': 'Currency',
            'widget_title': 'Would you like to leverage a widget like this one in your campaigns?',
            'widget_p1': 'Widget like this are always valued by customers.',
            'widget_p2': 'They are a great way to stimulate engagement and get more people to talk about your products.',
            'widget_p3': 'It\'s also a great way to generate leads.',
            'widget_link': 'Click here to learn more about how to get one.',
            'logo_credit': 'Logo: Designed by Freepik',
            'metrics_over_time': 'Metrics Over Time',
            'revenue': 'Revenue',
            'launching_customers': 'Launching Customers',
            'revenue_per_conversion': 'Revenue Per Conversion',
            'customer_growth_rate': 'Customer Growth Rate',
            'average_response_rate': 'Average Response Rate',
            'expenses': 'Expenses',
            'customer_churn_rate': 'Customer Churn Rate',
            'variable_cost': 'Variable Cost',
            'fixed_costs': 'Fixed Costs',
            'starting_cost': 'Starting Cost',
            'campaign_summary': 'Campaign Summary',
            'profitable_in_week': 'Profitable in week #',
            'at_week': 'At week #',
            'customers': 'Customers:',
            'revenue_label': 'Revenue:',
            'expenses_label': 'Expenses:',
            'total_profit': 'Total Profit',
            'average_retention': 'Average Retention',
            'weeks': 'weeks',
            'return_on_investment': 'Return on investment',
            'download_csv': 'Download CSV',
            'load_csv': '↑ Load CSV',
            'lets_connect': 'Let\'s connect'
        },
        'bulgarian': {
            'title': 'ПРОГНОЗАТОР НА РЕЗУЛТАТИ',
            'subtitle': 'ИМЕЙЛ КАМПАНИЯ',
            'language': 'Език',
            'time_unit': 'Времева единица',
            'week': 'Седмица',
            'periods': 'Брой периоди',
            'currency': 'Валута',
            'widget_title': 'Искате ли да използвате подобен уиджет във вашите кампании?',
            'widget_p1': 'Подобни уиджети винаги се ценят от клиентите.',
            'widget_p2': 'Те са чудесен начин да стимулирате ангажираността и да накарате повече хора да говорят за вашите продукти.',
            'widget_p3': 'Също така е чудесен начин за генериране на потенциални клиенти.',
            'widget_link': 'Кликнете тук, за да научите повече как да получите такъв.',
            'logo_credit': 'Лого: Дизайн от Freepik',
            'metrics_over_time': 'Показатели във времето',
            'revenue': 'Приходи',
            'launching_customers': 'Стартиращи клиенти',
            'revenue_per_conversion': 'Приход на конверсия',
            'customer_growth_rate': 'Темп на растеж на клиентите',
            'average_response_rate': 'Среден процент на отговор',
            'expenses': 'Разходи',
            'customer_churn_rate': 'Процент на отлив на клиенти',
            'variable_cost': 'Променливи разходи',
            'fixed_costs': 'Фиксирани разходи',
            'starting_cost': 'Начални разходи',
            'campaign_summary': 'Обобщение на кампанията',
            'profitable_in_week': 'Печеливша през седмица #',
            'at_week': 'През седмица #',
            'customers': 'Клиенти:',
            'revenue_label': 'Приходи:',
            'expenses_label': 'Разходи:',
            'total_profit': 'Обща печалба',
            'average_retention': 'Средно задържане',
            'weeks': 'седмици',
            'return_on_investment': 'Възвръщаемост на инвестициите',
            'download_csv': 'Изтегляне на CSV',
            'load_csv': '↑ Зареждане на CSV',
            'lets_connect': 'Да се свържем'
        }
    };

    function setLanguage(lang) {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
    }

    document.getElementById('language').addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });

    function calculate() {
        const periods = parseInt(inputs.periods.value);
        const launchingCustomers = parseFloat(inputs.launchingCustomers.value);
        const revenuePerConversion = parseFloat(inputs.revenuePerConversion.value);
        const customerGrowthRate = parseFloat(inputs.customerGrowthRate.value);
        const averageResponseRate = parseFloat(inputs.averageResponseRate.value);
        const customerChurnRate = parseFloat(inputs.customerChurnRate.value);
        const variableCost = parseFloat(inputs.variableCost.value);
        const fixedCosts = parseFloat(inputs.fixedCosts.value);
        const startingCost = parseFloat(inputs.startingCost.value);

        let customers = [launchingCustomers];
        let revenues = [];
        let expenses = [];
        let profits = [];
        let cumulativeProfit = 0;
        let profitableWeek = -1;

        for (let i = 0; i < periods; i++) {
            let currentCustomers = (i === 0) ? launchingCustomers : customers[i-1] * (1 + customerGrowthRate - customerChurnRate);
            customers.push(currentCustomers);

            let periodRevenue = currentCustomers * averageResponseRate * revenuePerConversion;
            revenues.push(periodRevenue);

            let periodExpenses = fixedCosts + (currentCustomers * variableCost) + (i === 0 ? startingCost : 0);
            expenses.push(periodExpenses);

            let periodProfit = periodRevenue - periodExpenses;
            profits.push(periodProfit);
            
            cumulativeProfit += periodProfit;
            if (cumulativeProfit > 0 && profitableWeek === -1) {
                profitableWeek = i + 1;
            }
        }
        
        const totalCustomers = customers.slice(1).reduce((a, b) => a + b, 0);
        const totalRevenue = revenues.reduce((a, b) => a + b, 0);
        const totalExpenses = expenses.reduce((a, b) => a + b, 0);
        const totalProfit = totalRevenue - totalExpenses;
        const totalInvestment = startingCost + expenses.reduce((a,b) => a + b, 0);
        const roi = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
        const averageRetention = customerChurnRate > 0 ? 1 / customerChurnRate : 0;

        updateSummary({
            profitableWeek: profitableWeek,
            summaryWeek: periods,
            customers: Math.round(customers[customers.length-1]),
            revenue: totalRevenue,
            expenses: totalExpenses,
            profit: totalProfit,
            retention: averageRetention,
            roi: roi
        });

        updateChart(profits, customers.slice(1));
    }

    let lastSummaryData = {};

    function updateSummary(data) {
        const duration = 500;
        if (lastSummaryData.customers !== data.customers) {
            animateValue(summary.customers, lastSummaryData.customers || 0, data.customers, duration);
        }
        if (lastSummaryData.revenue !== data.revenue) {
            animateDecimalValue(summary.revenue, lastSummaryData.revenue || 0, data.revenue, duration);
        }
        if (lastSummaryData.expenses !== data.expenses) {
            animateDecimalValue(summary.expenses, lastSummaryData.expenses || 0, data.expenses, duration);
        }
        if (lastSummaryData.profit !== data.profit) {
            animateDecimalValue(summary.profit, lastSummaryData.profit || 0, data.profit, duration);
        }
        if (lastSummaryData.retention !== data.retention) {
            animateDecimalValue(summary.retention, lastSummaryData.retention || 0, data.retention, duration);
        }
        if (lastSummaryData.roi !== data.roi) {
            animateDecimalValue(summary.roi, lastSummaryData.roi || 0, data.roi, duration);
        }

        summary.profitableWeek.textContent = data.profitableWeek > 0 ? data.profitableWeek : 'N/A';
        summary.summaryWeek.textContent = data.summaryWeek;

        lastSummaryData = data;
    }

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function animateDecimalValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = progress * (end - start) + start;
            element.innerHTML = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateChart(profitData, customerData) {
        const labels = Array.from({ length: profitData.length }, (_, i) => i + 1);
        const lang = document.getElementById('language').value;

        if (metricsChart) {
            metricsChart.destroy();
        }

        metricsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: translations[lang].total_profit,
                        data: profitData.map((val, i) => profitData.slice(0, i + 1).reduce((a, b) => a + b, 0)),
                        borderColor: 'var(--accent-color-2)',
                        backgroundColor: 'var(--accent-color-2)',
                        yAxisID: 'y',
                        tension: 0.4,
                        fill: false,
                        pointBackgroundColor: 'var(--primary-text)',
                        pointBorderColor: 'var(--accent-color-2)',
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: 'var(--accent-color-2)',
                    },
                    {
                        type: 'bar',
                        label: translations[lang].customers,
                        data: customerData,
                        backgroundColor: 'var(--accent-color-1)',
                        yAxisID: 'y1',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'var(--primary-text)'
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            color: 'var(--secondary-text)'
                        },
                        grid: {
                            color: 'var(--border-color)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            color: 'var(--secondary-text)'
                        },
                        grid: {
                            drawOnChartArea: false, 
                        },
                    },
                    x: {
                        ticks: {
                            color: 'var(--secondary-text)'
                        },
                        grid: {
                            color: 'var(--border-color)'
                        }
                    }
                }
            }
        });
    }

    function updateChartLabels(lang) {
        if (metricsChart) {
            metricsChart.data.datasets[0].label = translations[lang].total_profit;
            metricsChart.data.datasets[1].label = translations[lang].customers.replace(':', '');
            metricsChart.update();
        }
    }

    Object.values(inputs).forEach(input => {
        if (input.type === 'range') {
            const sliderValueSpan = input.nextElementSibling;
            const updateSlider = () => {
                const value = input.value;
                const min = input.min || 0;
                const max = input.max || 100;
                const percent = ((value - min) / (max - min)) * 100;
                input.style.background = `linear-gradient(to right, var(--accent-color-1) ${percent}%, var(--background-color) ${percent}%)`;
                if (sliderValueSpan && sliderValueSpan.classList.contains('slider-value')) {
                    sliderValueSpan.textContent = value;
                }
            };
            input.addEventListener('input', () => {
                updateSlider();
                calculate();
            });
            updateSlider();
        } else {
            input.addEventListener('input', calculate);
        }
    });

    document.getElementById('download-csv').addEventListener('click', () => {
        const periods = parseInt(inputs.periods.value);
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Period,Customers,Revenue,Expenses,Profit\n";

        // Recalculate for CSV data
        const launchingCustomers = parseFloat(inputs.launchingCustomers.value);
        const revenuePerConversion = parseFloat(inputs.revenuePerConversion.value);
        const customerGrowthRate = parseFloat(inputs.customerGrowthRate.value);
        const averageResponseRate = parseFloat(inputs.averageResponseRate.value);
        const customerChurnRate = parseFloat(inputs.customerChurnRate.value);
        const variableCost = parseFloat(inputs.variableCost.value);
        const fixedCosts = parseFloat(inputs.fixedCosts.value);
        const startingCost = parseFloat(inputs.startingCost.value);

        let customers = [launchingCustomers];
        for (let i = 0; i < periods; i++) {
            let currentCustomers = (i === 0) ? launchingCustomers : customers[i] * (1 + customerGrowthRate - customerChurnRate);
            customers.push(currentCustomers);

            let periodRevenue = currentCustomers * averageResponseRate * revenuePerConversion;
            let periodExpenses = fixedCosts + (currentCustomers * variableCost) + (i === 0 ? startingCost : 0);
            let periodProfit = periodRevenue - periodExpenses;
            
            csvContent += `${i+1},${Math.round(currentCustomers)},${periodRevenue.toFixed(2)},${periodExpenses.toFixed(2)},${periodProfit.toFixed(2)}\n`;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "campaign_summary.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    calculate();
    setLanguage('english'); // Set default language
});
