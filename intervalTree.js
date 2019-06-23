class RangeNode {
    constructor(range) {
        this.range = range;
        this.max = 0;
        this.left = null;
        this.right = null;

    }
}

module.exports = class IntervalTree {
    constructor(){
        this.root = null;
    }

    createNewRangeNode(range) {
        var tempNode = new RangeNode(range);
        tempNode.max = range[1];
        tempNode.left = null;
        tempNode.right = null;

        return tempNode;
    }

    insert(root, range) {

        if (root === null) {
            return this.createNewRangeNode(range);
        }

        var rootLowVal = root.range[0];

        if (range[0] < rootLowVal) {
            root.left = this.insert(root.left, range);
        }
        else {
            root.right = this.insert(root.right, range);
        }

        // Update max value of this root if it's less than current range high value
        if (root.max < range[1]) {
            root.max = range[1];
        }

        return root;
    }

    remove(root, range) {
        if (root === null) {
            return null;
        }

        var rootLowVal = root.range[0];

        if (range[0] < rootLowVal) {
            root.left = this.remove(root.left, range);
            return root;
        }
        else if (range[0] > rootLowVal) {
            root.right = this.remove(root.right, range);
            return root;
        }
        else {
            if (root.left === null && root.right === null) {
                root = null;
                return root;
            }

            if (root.left === null) {
                root = root.right;
                return root;
            }
            else if (root.right === null) {
                root = root.left;
                return root;
            }

            var replacementRangeNode = this.findMinRangeNode(root.right);
            root.range = replacementRangeNode.range;
            root.max = replacementRangeNode.max;

            // Remove the replacement node
            root.right = this.remove(root.right, replacementRangeNode.range);
            return root;
        }
    }

    isWithin(range1, range2) {
        if (range1[0] <= range2[1] && range2[0] <= range1[1]) {
            return true;
        }
        else {
            return false;
        }
    }

    isWithInSearch(root, range) {
        if (root === null) {
            return null;
        }

        if (this.isWithin(root.range, range)) {
            return root;
        }

        if (root.left !== null && root.left.max >= range[0]) {
            return this.isWithInSearch(root.left, range);
        }
        else {
            return this.isWithInSearch(root.right, range);
        }
    }

    search(root, range, overlappingRanges) {
        if (root === null) {
            return;
        }

        if (range[0] > root.max) {
            return;
        }

        if (root.left !== null) {
            this.search(root.left, range, overlappingRanges);
        }

        if (this.isWithin(root.range, range)) {
            overlappingRanges.push(root);
        }

        if (range[1] < root.range[0]) {
            return;
        }

        if (root.right !== null) {
            this.search(root.right, range, overlappingRanges);
        }
    }

    findMinRangeNode(root) {
        if (root.left === null) {
            return root;
        } else {
            return this.findMinRangeNode(root.left);
        }
    }

    print(root) {
        var rangeNodeList = [];
        this.nodesInOrder(root, rangeNodeList);
        
        var rangeNodeListString = "";
        var i;
        for (i = 0; i < rangeNodeList.length; i++) {
            rangeNodeListString += "[" + rangeNodeList[i][0].toString() + ", " + rangeNodeList[i][1].toString() + ") ";
        }

        console.log(rangeNodeListString);
    }

    nodesInOrder(root, rangeNodeList) {
        if (root === null) {
            return;
        }

        this.nodesInOrder(root.left, rangeNodeList);
        rangeNodeList.push(root.range);
        this.nodesInOrder(root.right, rangeNodeList);
    }
}