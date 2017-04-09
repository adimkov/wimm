import * as React from 'react';
import { Map, List } from 'immutable';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
const ChartistTooltips = require('chartist-plugin-tooltips');// because of design emulation of common js

import { Container } from './container';
import { Actions } from '../action/action';
import ReactResizeDetector from 'react-resize-detector';
import { calculateWorkSpaceHeight } from '../services/calendarcalculator';
import * as FinanceModel from '../model/finance';
import { financeStore } from '../store/finance';
import { toolbarStore } from '../store/toolbar';
import { spendingStore } from '../store/spending';

interface MonthChartProp {
    monthData: Map<number, List<FinanceModel.Spending>>;
    categorySpending: List<FinanceModel.Spending>;
    categories: Array<FinanceModel.Category>;
}

interface MonthChartState {
    browserHeight: number;
}

class MonthChart extends React.Component<MonthChartProp, MonthChartState> {
    constructor(props?: MonthChartProp, context?: any) {
        super(props, context);
        this.state = {browserHeight: document.body.clientHeight};
    }

    onResize(width: number, height: number) {
        this.setState({browserHeight: height});
    }
    
    getChartOptions() {
        return {
            stackBars: true,
            height: calculateWorkSpaceHeight(this.state.browserHeight) - 30,
            plugins: [
                ChartistTooltips()
            ]
        }
    }

    onDraw(context) {
        if(context.type === 'bar') {
            context.element.attr({
                style: 'stroke-width: 30px; stroke: ' + this.props.categories[context.seriesIndex].color
            });
        }  
    }

    getData() {
        let days = this.props.monthData.entrySeq().toArray().map(x => x[0]);
        let series = new Array<Array<any>>()
        let categories = this.props.categories;

        for(let category of categories.map(x => x.code)) {
            let categorySpendings = new Array<any>();

            for(let day of days) {
                var daySpendings = this.props.monthData.get(day);
                let spending = daySpendings.find(x => x.category.code === category);
                if (spending !== undefined) {
                    categorySpendings.push({meta: spending.category.name, value: Number.parseInt(spending.amount.toString())});
                }
                else {
                    categorySpendings.push({meta: '', value: 0});
                }
            }

            series.push(categorySpendings);
        }
        
        return {labels: days, series: series}
    }

    getCategoryAmount(categoryCode: string): number {
        let spendingIndex = this.props.categorySpending.findIndex(x => x.category.code === categoryCode);
        if (spendingIndex > 0) {
            return Number.parseFloat(this.props.categorySpending.get(spendingIndex).amount.toString());
        }

        return 0;
    }

    render() {
        let listener = {
            draw: this.onDraw.bind(this)
        }
        
        let legend = this.props.categories.map(x => <CategoryLegendItem key={x.code} category={x} sumAmount={this.getCategoryAmount(x.code)}/>)
        return (
            <div className="report">
                <ReactResizeDetector handleHeight handleWeight onResize={ this.onResize.bind(this) } />
                <ChartistGraph data={this.getData()} options={this.getChartOptions()} listener={listener} type={'Bar'} />
                <ul className='chart-legend'>
                    {legend}
                </ul>
            </div>
        )
    }
}

interface ChartLegendItem {
    category: FinanceModel.Category
    sumAmount: number
}

class CategoryLegendItem extends React.Component<ChartLegendItem, void> {
   constructor(props?: ChartLegendItem, context?: any) {
        super(props, context);
    }

    render () {
        
        return (
            <li className='chart-legend-item' style={{borderColor: this.props.category.color}}>
                ({this.props.sumAmount.toFixed(2)}) {this.props.category.name}
            </li>
        )
    }
}

interface MonthChartContainerState {
    monthData: Map<number, List<FinanceModel.Spending>>;
    categorySpending: List<FinanceModel.Spending>;
    categories: Array<FinanceModel.Category>;
}

export default class MonthChartContainer extends Container<void, MonthChartContainerState> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }

    getStores() {
        return [
            financeStore, toolbarStore
        ];
    }

    calculateState() {
        let year = toolbarStore.getCalendarOptions().year;
        let month = toolbarStore.getCalendarOptions().month;
        let categories = spendingStore.getCategories().toArray();
        let categorySpending = financeStore.getSpendingStatisticForCalendar(year, month).monthSpending;

        return {
            monthData: financeStore.getMonthChartData(year, month),
            categorySpending: categorySpending,
            categories: categories,
        }
    }

    render() {
        return (
                <MonthChart monthData={this.state.value.monthData} categories={this.state.value.categories} categorySpending={this.state.value.categorySpending}/>
            );
    }
}

