IntervalTree = require('./intervalTree.js');

class RangeList {
    constructor() {
        this.data = new IntervalTree();
    }

    /**
     * Adds a range to the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    add(range) {
        // Invalid range passed
        if (range.length != 2) {
            return;
        }

        // Find all ranges that overlap the supplied range
        var overlappingRanges = [];
        this.data.search(this.data.root, range, overlappingRanges);

        // If doesn't exist then simply add it
        if (overlappingRanges.length == 0) {
            this.data.root = this.data.insert(this.data.root, range);
            return;
        }

        // Handle case where supplied range fully overlaps multiple ranges in the list
        var i;
        var rangeNode;
        var newRangeAdded = false;
        for (i = overlappingRanges.length - 1; i >= 0; i--) {
            rangeNode = overlappingRanges[i];
            if (range[0] <= rangeNode.range[0] && range[1] >= rangeNode.range[1]) {
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                if (newRangeAdded == false) {
                    this.data.root = this.data.insert(this.data.root, range);
                    newRangeAdded = true;
                }
                overlappingRanges.splice(i, 1);    
            }
        }

        // Handle cases of partial overlap
        for (i = 0; i < overlappingRanges.length; i++) {
            rangeNode = overlappingRanges[i];

            // Existing range already covers new range
            if(rangeNode.range[0] <= range[0] && rangeNode.range[1] >= range[1]) {
                return;
            }
            // New range decrements the low of the existing range
            else if (range[0] < rangeNode.range[0] && rangeNode.range[1] >= range[1]) {
                rangeNode.range[0] = range[0];
            }
            // New range increments the high of the existing range
            // Remove and Insert to maintain tree max
            else if (rangeNode.range[0] <= range[0] && range[1] > rangeNode.range[1]) {
                var newRange = [rangeNode.range[0], range[1]];
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                this.data.root = this.data.insert(this.data.root, newRange);
            }
        }
    }

    /**
     * Removes a range from the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    remove(range) {
        if (range.length != 2) {
            return;
        }

        // Find all ranges that overlap the supplied range
        var overlappingRanges = [];
        this.data.search(this.data.root, range, overlappingRanges);

        var i;
        var rangeNode;
        for (i = 0; i < overlappingRanges.length; i++) {
            rangeNode = overlappingRanges[i];

            // Existing range fully overlaps supplied range. Remove existing fully.
            if (rangeNode.range[0] >= range[0] && rangeNode.range[1] <= range[1]) {
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
    
            } 
            // Trim the low end of the existing range based on supplied range
            else if (range[0] <= rangeNode.range[0] && rangeNode.range[1] > range[1]) {
                rangeNode.range[0] = range[1];
            }
            // Overlap is on the high end. Remove existing range and insert new range
            // the satisfies a smaller high end. Remove, insert to maintain max of tree
            else if (rangeNode.range[0] < range[0] && range[1] >= rangeNode.range[1]) {
                var newRange = [rangeNode.range[0], range[0]];
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                this.data.root = this.data.insert(this.data.root, newRange);
            }
            // Supplied range splits existing range in the middle.
            // Remove overlapping sectiond and insert back non-overlapping sections
            else if (rangeNode.range[0] < range[0] && rangeNode.range[1] > range[1]) {
                var firstNewRange = [rangeNode.range[0], range[0]];
                var secondNewRange = [range[1], rangeNode.range[1]];
    
                this.data.root = this.data.remove(this.data.root, rangeNode.range);
                this.data.root = this.data.insert(this.data.root, firstNewRange);
    
                this.data.root = this.data.insert(this.data.root, secondNewRange);
            } 
        }

    }

    /**
     * Prints out the list of ranges in the range list
     */
    print() {
        this.data.print(this.data.root);
    }

}

const rl = new RangeList();

rl.add([1, 5]);
rl.print();

rl.add([10, 20]);
rl.print();

rl.add([20, 20]);
rl.print();

rl.add([20, 21]);
rl.print();

rl.add([2, 4]);
rl.print();

rl.add([3, 8]);
rl.print();

rl.add([50, 60]);
rl.print();

rl.add([55, 62]);
rl.print();


rl.remove([10, 10]);
rl.print();

rl.remove([10, 11]);
rl.print();

rl.remove([15, 17]);
rl.print();

rl.remove([3, 19]);
rl.print();

rl.add([1, 25]);
rl.print();

