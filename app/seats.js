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
        this.seats_spec = seats_spec;
        this.seats_dimension = this.getSeatsDimension()
        this.seats_type = this.getSeatsType() // 3D Array with
        this.seats_by_priority = this.getSeatsPriorityList()
    }
    // to get max rows and columns
    getSeatsDimension() {
        let rows = []
        let columns = []
        let total_block = this.seats_spec.length
        for (let i=0; i < total_block; i++ ) {
            columns.push(this.seats_spec[i][0])
            rows.push(this.seats_spec[i][1])
        }
        let total_columns = columns.reduce((a, b) => a + b, 0)
        let total_rows = Math.max(...rows)
        return {
            'columns':total_columns, 
            'rows': total_rows
        }
    }

    // Get 3D array with type of seats
    getSeatsType() {
        let total_block = this.seats_spec.length
        let total_rows = this.seats_dimension.rows

        let all_seats_details = []
        for (let b=0; b < total_block; b++){
            let seat_block = this.seats_spec[b]
            let block_seats_detail = []
            for (let i=0; i < total_rows; i++ ){
                block_seats_detail[i] = block_seats_detail[i] || []
                for (let j=0; j < seat_block[0]; j++){

                    // if the block has the row
                    if (i<seat_block[1]){
                        // if left seat of block its a Window
                        if (j == 0) {
                            block_seats_detail[i][j] = (b == 0) ? seatTypeMap.WINDOW : seatTypeMap.AISLE
                        } else if (j == (seat_block[0]-1)) {
                            block_seats_detail[i][j] = (b == (total_block-1)) ? seatTypeMap.WINDOW : seatTypeMap.AISLE
                        }else {
                            block_seats_detail[i][j] = seatTypeMap.CENTER
                        }
                    }   else {
                        block_seats_detail[i][j] = seatTypeMap.NOSEAT
                    }
                }
            }
            all_seats_details.push(block_seats_detail)
        }
        return all_seats_details
    }

    // Get ordered listed  of seat positions based on priority
    getSeatsPriorityList() {
        if (!this.seats_type 
            || this.seats_type.length == 0) {
                
            return
        }
        let seat_order = {
            'ALL': []
        }
        seatPriorityOrder.forEach(function(type){
            if (type === 'NOSEAT') return
            seat_order[seatTypeMap[type]] = []
        })
        let total_block = this.seats_spec.length;
        for (let r=0; r < this.seats_dimension.rows; r++) {
            for (let b=0; b < total_block; b++) {
                for (let c=0; c < this.seats_spec[b][0]; c++) {
                    seatPriorityOrder.forEach(function(type){
                        if (type === 'NOSEAT') return
                        if (this.seats_type[b][r][c] === seatTypeMap[type]) {
                            seat_order[seatTypeMap[type]].push([b, r, c])
                        }
                    }.bind(this)) 
                }
            }
        }
        seatPriorityOrder.forEach(function(type){
            seat_order.ALL = seat_order.ALL.concat(seat_order[seatTypeMap[type]])
        })
        return seat_order
    }

    // print the formatted allocations
    allocatePassengers (passenger_count) {
        let seats = this.seats_type.slice(0)
        console.log(`Passenger Count: ${passenger_count}`)
        console.log('Given Seat Spec: ' + JSON.stringify(this.seats_spec))
        console.log('---------------')
        // console.log(this.seats_by_priority.ALL)
        let seatsOrder = this.seats_by_priority.ALL
        for (let i=0; i < passenger_count; i++ ) {
            let current_seat = seatsOrder[i]
            seats[current_seat[0]][current_seat[1]][current_seat[2]] = i+1
        }

        let total_block = this.seats_spec.length;
        for (let r=0; r < this.seats_dimension.rows; r++) {
            for (let b=0; b < total_block; b++) {
                for (let c=0; c < this.seats_spec[b][0]; c++) {
                    if (seats[b][r][c] === seatTypeMap.NOSEAT) {
                        process.stdout.write('   ')
                    } else {
                        let pass_str = this.pad(seats[b][r][c],2)
                        process.stdout.write(pass_str+' ')                        
                    }
                }
                process.stdout.write(' | ')
            }
            console.log(' ')
        }

    }
    pad(num, size) {
        let s
        if(Number.isInteger(num)) {
            s = "000000000" + num;
        } else {
            s = "---------" + num;
        }
        return s.substr(s.length-size);
    }
    validateSeatsSpec() {
        return 1
    }
    getTotalSeats() {
        return 1
    }
}

module.exports = Seats