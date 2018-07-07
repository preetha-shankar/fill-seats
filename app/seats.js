'use strict'
const seatTypeMap = {
    'WINDOW': 'W',
    'AISLE': 'A',
    'CENTER': 'C',
    'NOSEAT': 'X'
}
const seatPriorityOrder = [
    'AISLE',
    'WINDOW',
    'CENTER'
]
class Seats {
    constructor (seats_spec) {
     
        this.seats_spec = seats_spec
        this.seats_stat = {
            'dimension': [],
            'columns': {},
            'block_start_columns': []
        }
        this.setSeatsStats()
        this.seats_matrix = this.getSeatsMatrix()
        this.seats_by_priority = this.getSeatsPriority()
    }
    isSeatsSpecValid(seats_spec) {
        if(!seats_spec.length <2) {
            return new Error('Seats specification whould have atleast two blocks of seats')
        } 
    }
    // to seats dimension & Column types
    setSeatsStats() {
        let total_columns = 0
        let total_rows = 0
        let total_block = this.seats_spec.length
        let total_seats = 0
        let block_start_column = 0
        for (let i=0; i < total_block; i++ ) {
            total_seats += (this.seats_spec[i][0] * this.seats_spec[i][1]) 
            total_columns += this.seats_spec[i][0]

            if (i !== total_block-1) {
                block_start_column += (this.seats_spec[i][0])
                this.seats_stat.block_start_columns.push(block_start_column)
    
                this.seats_stat.columns[total_columns] = seatTypeMap.AISLE
                this.seats_stat.columns[total_columns-1] = seatTypeMap.AISLE
            }
            total_rows = (this.seats_spec[i][1] > total_rows) 
                ? this.seats_spec[i][1]
                : total_rows

        }
        this.seats_stat.columns[0] = seatTypeMap.WINDOW
        this.seats_stat.columns[total_columns-1] = seatTypeMap.WINDOW
        this.seats_stat.dimension = {
            'columns':total_columns, 
            'rows': total_rows,
            'total_seats': total_seats
        }
    }

    getSeatsMatrix() {
        let seats_matrix = [[]]

        // initate seats_matrix
        let currentColumn = 0
        for (let b=0; b < this.seats_spec.length; b++) {
            let rows = this.seats_spec[b][1]
            currentColumn += this.seats_spec[b][0]
            for(let r = 0; r < this.seats_spec[b][1]; r++) {
                seats_matrix[r] = seats_matrix[r] || []
                for (let c = (currentColumn - this.seats_spec[b][0]); 
                    c < currentColumn; 
                    c++) {
                        seats_matrix[r][c] = this.seats_stat.columns[c] || seatTypeMap.CENTER
                    }
            }
        }
        return seats_matrix
    }

    getSeatsPriority () {
        if (this.seats_matrix.length === 0
            || this.seats_stat.total_seats === 0) {
       
            return
        }
        let seats_by_priority = {}
        seatPriorityOrder.forEach(function(type){
            let seat_type = seatTypeMap[type]
            seats_by_priority[seat_type] = []
        })
        for (let row = 0; row < this.seats_stat.dimension.rows; row++) {
            for (let col = 0; col < this.seats_stat.dimension.columns; col++) {
                let seat_type = this.seats_matrix[row][col]
                if (seat_type) {
                    seats_by_priority[seat_type].push([row,col])
                }
            }
        }
        seats_by_priority.ALL = []
        seatPriorityOrder.forEach(function(type){
            let seat_type = seatTypeMap[type]
            seats_by_priority.ALL = seats_by_priority.ALL.concat(seats_by_priority[seat_type])
        })
        return seats_by_priority.ALL
    }
    displaySeatMap (passenger_count) {

        // let passenger_count = this.seats_stat.dimension.total_seats
        console.log('')
        console.log(`Passenger Count: ${passenger_count}`)
        console.log('Given Seat Spec: ' + JSON.stringify(this.seats_spec))
        console.log('---------------')
        
        let seats = this.seats_matrix.slice(0)
        let seatsOrder = this.seats_by_priority
        for (let i=0; i < passenger_count; i++ ) {
            let current_seat = seatsOrder[i]
            seats[current_seat[0]][current_seat[1]] = i+1
        }
        for (let row = 0; row < this.seats_stat.dimension.rows; row++) {
            for (let col = 0; col < this.seats_stat.dimension.columns; col++) {
                let printStr = (seats[row][col]) ? seats[row][col] : ' '
                printStr = this.pad(printStr, 2)
                printStr += ' '
                if (this.seats_stat.block_start_columns.includes(col)) {
                    printStr = '| ' + printStr
                }
                process.stdout.write(printStr)
            }
            console.log('')
        }
    }

    pad(num, size) {
        let s
        if(Number.isInteger(num)) {
            s = "000000000" + num
        } else {
            s = "---------" + num
        }
        return s.substr(s.length-size)
    }
}

module.exports = Seats