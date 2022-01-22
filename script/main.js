
//character count
// const charCount = (str) =>{
//     //make object to return at the end
//     let result = {};
//     //loop over string, for each character
//     for(let i=0;i<str.length;i++){
//         let char= str[i].toLowerCase();
//         // use regexp to test if char is alphanumeric
//         if(/[a-z0-9]/.test(char)){

//         // if the char is a number/etter and is a key in object, add one to count
//         if(result[char]>0){
//             result[char]++;
//         }
//         // if the char is a number/letter and not in the object, add it to the object and set the value to 1
//         else{
//             result[char]=1;
//         }
//     }
//         //if the character is something else(space,period,etc.) don't do anything
//     }
//     // return object
// return result;
// }

//refactored
const charCount = (str) => {
    //make object to return at the end
    let result = {};
    //loop over string, for each character using 'for of' loop.
    for (let char of str) {
        // use regexp to test if char is alphanumeric
        // regexp time complexity might have issues
        // if(/[a-z0-9]/.test(char))
        // better to use char code comparison
        if (isAlphaNumeric(char)) {
            char.toLowerCase();
            //truthy or falsy conditional 
            // if there's a value in obj[char] add 1 obj[char]=++obj[char]
            //if there's nothing in there, a falsy, set it to 1 obj[char]=1 
            result[char] = ++result[char] || 1;
        }
        //if the character is something else(space,period,etc.) don't do anything
    }
    // return object
    return result;
}

const isAlphaNumeric = (char) => {
    let code = char.charCodeAt(0)
    if (!(code > 47 && code < 58) && //(0-9)
        !(code > 64 && code < 91) && //(A-Z)
        !(code > 96 && code < 123)) { // (a-z)
        return false
    }
    else {
        return true
    }
}
//////////////////////////////////////////////////////////////////////////////////////////

//array that has square of element in second array. must have same frequency
//simple 0(n^2) quadratic approach
//avoid nested loops whenever possible
// const same= (arr1,arr2) =>{
//     // if the arrays don't equal in length then frequency is not the same and you return false
//     if(arr1.length!==arr2.length){
//         return false;
//     }
// //if the lengths are the same you loop through the first array
// for(let i=0;i<arr1.length;i++){
//     //determine the indexOf the square of arr1[i] in arr2
//     let correctIndex = arr2.indexOf(arr1[i]**2)
//     //if it doesn't exist then you exit by returning false
//     if(correctIndex===-1){
//         return false;
//     }
//     //if it exist you remove the element from arr2
//     arr2.splice(correctIndex,1)
// }
// //if all the square of element in arr1 is equal to the frequency of that number in 2 then you return true
// return true;
// } 

//0(n) approach by using the frequency counter pattern
const same = (arr1, arr2) => {
    // if the arrays don't equal in length then frequency is not the same and you return false
    if (arr1.length !== arr2.length) {
        return false;
    }
    //create objects to store each array in 
    let frequencyCounter1 = {};
    let frequencyCounter2 = {};
    //instead of checking for each element in the first array by looping through the second array everytime
    //you loop through both separately one time only
    //use 'for of' loop instead of standard 'for' loop for coding readability
    for (let val of arr1) {
        // for current val assign frequencyCounter1[val] the current count +1 if it exist or 0 +1 if it doesn't
        frequencyCounter1[val] = (frequencyCounter1[val] || 0) + 1;
    }
    for (let val of arr2) {
        frequencyCounter2[val] = (frequencyCounter2[val] || 0) + 1;
    }
    // iterates over the key in frequencyCounter1. for each one
    for (let key in frequencyCounter1) {
        //The in operator returns true if the specified property is in the specified object or its prototype chain.
        // if key^2 is not in frequency counter2 return false 
        if (!(key ** 2 in frequencyCounter2)) {
            return false
        }
        // if the number of key^2 in frequencycounter2 doesn't equal the number of key in frequencycounter1 return false
        if (frequencyCounter2[key ** 2] !== frequencyCounter1[key]) {
            return false
        }
    }
    //outside of the for loop if both arrays pass both conditions return true
    return true;
}

/////////////////////////////////////////////////////////////////////////////////

//Given two strings, write a function to determine if the second string is an anagram of the first
// const validAnagram = (str1,str2) =>{

//     if(str1.length!==str2.length){
//         return false;
//     }
//     const arr1 = str1.split('');
//     const arr2 = str2.split('');
//     const frequencyCounter1={};
//     const frequencyCounter2={};

//     for(let char in arr1){
//         frequencyCounter1[char]=(frequencyCounter1[char]||0)+1;
//     }
//     for(let char in arr2){
//         frequencyCounter2[char]=(frequencyCounter2[char]||0)+1;
//     }

//     for(let key in frequencyCounter1 ){
//         if(!(key in frequencyCounter2)){
//             return false;
//         }
//         if(frequencyCounter2[key]!==frequencyCounter1[key]){
//             return false;
//         }
//     }
//     return true;
// }

//refactored validanagram algo
const validAnagram = (first, second) => {
    if (first.length !== second.length) {
        return false;
    }

    const lookUp = {}

    for (let i = 0; i < first.length; i++) {
        let letter = first[i]
        //if letter exists,increment,otherwise set to 1
        lookUp[letter] ? lookUp = +1 : lookUp = 1;
    }
    for (let i = 0; i < second.length; i++) {
        let letter = second[i]
        //can't find letter or letter is zero then it's not an anagram
        if (!lookUp[letter]) {
            return false
        }
        else {
            // remove one count of the letter from the lookUp object if it is found
            lookUp[letter] -= 1
        }
    }
    //if for loop completes and every letter matches return true
    return true
}

/////////////////////////////////////////////////////////////////////////////////

//first pair that sums up to zero for sorted array of integers
//use multiple pointers approach for 0(n) linear time complexity
//constant space complexity of 0(1)
const sumZero = (arr) => {
    //initialize index on left
    let left = 0;
    //initialize index on right
    let right = arr.length - 1;
    // while the left index is smaller than the right loop through the array using pointers on both
    //ends converging on the middle
    //this will only run when left is smaller than right or else you might get a false positive if 
    //left equals right
    while (left < right) {
        // add the left element to the right element
        let sum = arr[left] + arr[right];
        // if they add up to 0 return the elements
        if (sum === 0) {
            return [arr[left], arr[right]]
        }
        //if they add up greater than zero that means that the right number is too big and the next element down
        //needs to be pointed to, so you reduce the index by one
        else if (sum > 0) {
            right--;
        }
        //if they add up smaller than zero that means that the left number is too small and needs to be bigger in value
        //so you increase the index by one.
        else {
            left++;
        }
    }
    //if the left or right index overtake each other return no pair
    return 'No pair found to sum up to zero'
}

///////////////////////////////////////////////////////////////////////////////////

//implement a function called countUniqueValues, which accepts a sorted array and counts the unique values in the array.
//There can be negative numbers in the array, but it will be sorted
//multiple pointer algo has a time complexity of o(n)
const countUniqueValues = (arr) => {
    // empty array
    if (!arr.length) {
        return 0
    }
    // first pointer will sit on the index until the second pointer encounters a new unique value
    // when that happens you increase the first pointers index by one and assign the unique value to that new spot
    // this will consequently track the number of unique elements when you add one to the index at the end 
    let first = 0;
    // 2nd pointer will start off by pointing to the index one ahead of the first pointer 
    for (let sec = 1; sec < arr.length; sec++) {
        // if the elements are not equal you increase first by one and assign the element at the second to it
        // and the second pointer index automatically moves up by one in the loop
        if (arr[first] !== arr[sec]) {
            first++;
            arr[first] = arr[sec];
        }
    }
    // add one to the index to indicate the number of unique values
    return first + 1

}
///////////////////////////////////////////////////////////////////////////////////
//Write a function called maxSubarraySum which accpts an array of integers and a number called n. The function
//should calculate the maximum sum of n consecutive elements in the array.

// bad quadratic time complexity of 0(n^2)
// const maxSubarraySum = (arr,num) =>{
//     if(num>arr.length){
//         return null
//     }
//     let max = -Infinity;
//     for(let i =0; i<arr.length-num+1;i++){
//         temp=0;
//         for(let j=0; j<num;j++){
//             temp += arr[i+j];
//         }
//         if(temp>max){
//             max=temp
//         }
//         console.log(temp,max)
//     }
//     return max
// }

//refactored using sliding window approach ends up with 0(n) time complexity
// sliding window works by adding the next element at the end of the entire group of n number of elements that you
// want to add. you then subtract the first number in that group of n elements. you do this until you reach the end
// of the array, essentially sliding the group of elements/window up the array 
const maxSubarraySum = (arr, num) => {
    let maxSum = 0;
    let tempSum = 0;
    // if the desired group is bigger than the array
    if (arr.length < num) return null;
    // iterate through the elements in the array until you reach num
    for (let i = 0; i < num; i++) {
        //add to the maxsum with each and every element until you reach num
        maxSum += arr[i]
    }
    // assign maxSum to tempSum so that you can iterate through the ends of tempsum but at the same time
    //have maxSum as a constant variable that will be compared to the tempSum
    tempSum = maxSum;
    // iterate through the already set chunk by starting at the index of num which is one more than the element 
    //that the previous chunk finished at. 
    for (let i = num; i < arr.length; i++) {
        //You then subtract the first index of the last chunk by subtracting num from i. Afterwards 
        // you add the element that is one more than the chunk. That element is the iterator.
        tempSum = tempSum - arr[i - num] + arr[i];
        // compare maxSum to tempSum after each iteration. which ever is bigger is assigned to maxSum
        maxSum = Math.max(maxSum, tempSum);
    }
    // maxSum is returned
    return maxSum;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
//recursive function to count down to zero
const countDown = (num) => {
    // base case 
    //if num equals zero the recursion function stops and returns 
    if (num <= 0) {
        console.log('All done')
        return 'Done';
    }
    // if the base case is not reached it will print out and reduce num by one before calling the function again
    console.log(num);
    // reduces num everytime function is called
    num--;
    // calls the function because base case is not reached
    countDown(num);
}

//iterative function
// const countDown = (num) =>{
//     for(let i = num; i>0;i--){
//         console.log(i)
//     }
//     console.log('All done')
// }

/////////////////////////////////////////////////////////////////////////////////
//recursive function to sum up range of numbers
const sumRange = (num) => {
    //base case
    //if after recursive calls num finally reaches 1, return 1
    if (num === 1) return 1
    //if base case of num equaling 1 has not been reached continue to add num to the recursive call
    // of the function with num-1.
    return num + sumRange(num - 1)
}
// sumrange(3) 6 is returned from sumrange(3) after the edge case is met and the returns make their way up the callstack
//return 3 + sumrange(2) waits for sumbrange(2), 3 returns from sumrange(2), so 3+3 can be returned
//return 2 + sumrange(1) waits for sumrange(1), 1 returns from sumrange (1), so 2+1 can be returned
//edge case returns

//////////////////////////////////////////////////////////////////////////////////////
//factorial done iteratively
// const factorial = (num) =>{
//     let total = 1
//     for(let i =num; i>1; i--){
//         total *= i
//     }
//     return total
// }

//factorial done recursively
const factorial = (num) => {
    //base case
    //if after recursive calls num finally reaches 1, return 1
    if (num === 1) return 1
    //if base case of num equaling 1 has not been reached continue the recursive call
    // of the function with the argument minus one multiplied with the current argument 
    return num * factorial(num - 1)
}
// factorial(3) 6 is returned from factorial(3) after the edge case is met and the returns make their way up the callstack
//return 3 * factorial(2) waits for factorial(2), 2 returns from factorial(2), so 3*2 can be returned
//return 2 * factorial(1) waits for factorial(1), 1 returns from factorial(1), so 2*1 can be returned
// factorial(1) edge case returns 

//////////////////////////////////////////////////////////////////////////////////////
//recursive function to store odd numbers in an array using helper method recursion
// const collectOdds = (arr) => {

//     // store result outside of the helper method recursion so it doesn't get reset everytime
//     let result = []
//     //recursive helper method 
//     const helper = (helperInput) => {
//         //base case if the array is empty return to previous call 
//         if(helperInput.length===0){
//             return;
//         }
//         //if the element at index zero has a modulo of not zero it is then odd 
//         if(helperInput[0]%2!==0){
//             // if it is odd push it onto the results array
//             result.push(helperInput[0])
//         }
//         //recursively call this helper method again by passing in the sliced array with every element that comes after
//         //and including the indicated index.
//         //this is done until the array is empty
//         helper(helperInput.slice(1))
//     }
//     //calls the helper method so that it can recursively call itself to find the odd numbers in the array
//     helper(arr)

//     return result;

// }

//pure recursive approach to find odd elements in an array

const collectOdds = (arr) => {
    // array to store odd values only
    let newArr = [];

    //base case
    //after every slice the array shrinks by one element if the size of the array is at zero return the newArr
    if (arr.length === 0) return newArr
    //if the element does not have a mod of 0 at the index of 0 it is odd. if that is the case push that element onto
    //the newArr
    if (arr[0] % 2 !== 0) newArr.push(arr[0])
    //so that the newArr isn't constantly reset when collectOdds is recursively called you essentially concat
    //another newArr to the current one. What happens when the base case is reach is that it concats up the
    // stack so the initial run gets conctanated last That is done recursively until the original is sliced 
    // all the way to zero length 
    newArr = newArr.concat(collectOdds(arr.slice(1)))
    //newArr is returned to the function that called it with 
    return newArr
    //sidenote, concating an empty with an array will just resolve to the array without the empty array
}            //waits for this
//[1].concat(collectOdds([2,3,4,5]))
//waits for this, once all is computed will concat to [1] which is is the final return value of [1,3,5]
//[].concat(collectOdds([3,4,5]))
//waits for this, once computed will concat to [] which is [3,5]
//[3].concat(collectOdds([4,5]))
//waits for this, once computed will concat to [3] which is [3,5]
//[].concat(collectOdds([5]))
//waits for this, once computed will concat to [], which is [5]
//[5].concat(collectOdds([]))
//returns newArr which will be an empty arr and concats to [5]
////////////////////////////////////////////////////////////////////////////////////////

//Simple linear search function similar to indexOf. Linear time commplexity of 0(n)
const linearSearch = (arr, val) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) return i
    }
    return -1
}
/////////////////////////////////////////////////////////////////////////////////////////

//binary search algo
//pass in an array and the value to search for as arguments to the arr and val
//logarithmi time complexity of 0(logn) but best case can be contant time 0(1)
// log based time complexity is log base n to what power equals the number of elements every doubling of the number of
// elements is one extra step 
const binarySearch = (arr, val) => {
    // start and end are assigned the indexes to represent the beginning and end of the array
    // middle of the array needs to be determined by getting the average and setting that to math.floor
    let start = 0;
    let end = arr.length - 1
    let middle = Math.floor((start + end) / 2)
    //the algo finds the value in the array by constantly finding the middle of the start and end points until the element
    //is found in the middle . So you run a while loop to run until this condition is met
    // to prevent an infinite loop you must make sure start is less than or equal to end also
    while (arr[middle] !== val && start <= end) {
        //if the value is smaller than the middle element then you move the end one below the middle
        //in this case start will not change but end does
        if (val < arr[middle]) {
            // it's minus one because it's already established that the middle is not the number so you don't want to
            //evaluate the same element again
            end = middle - 1;
        }
        else {
            //in this case end does not change but start does
            //establish a new start and add one to middle if the value is greater than the middle value
            start = middle + 1
        }
        //after the start or end are reestablished, the middle must also be reestablished
        middle = Math.floor((start + end) / 2)
    }
    // return the middle because that will be the index of where the element is once the loop finishes
    // use ternary to determine if final pass reveals whether or not value is in array
    return arr[middle] !== val ? -1 : middle
}
// when you round down with two numbers right next to each other,the start position ends up being the new middle
//that is how the value is found if it ends up being in the start position
//[2,5,6,9,13,15,28,30]
// s     m          e
//[2,5,6,9,13,15,28,30]
//         s  m     e
//[2,5,6,9,13,15,28,30]
//               sm  e

//////////////////////////////////////////////////////////////////////////////////////
//string search algo
const naiveSearch = (long, short) => {
    //number of matches
    let count = 0;
    //loop over the long string
    for (let i = 0; i < long.length; i++) {
        // for each char in long string, loop over the short string
        for (let j = 0; j < short.length; j++) {
            // if there is a match, look ahead in the long string to look for match with next iteration within the loop
            //of the short string. if there isn't a match after looking ahead, break out of inner loop and proceed
            // to next iteration in long string.
            if (short[j] !== long[i + j]) break;
            //if j reaches the length of the short string and is a match and therefore hasn't broken out of the inner loop
            // then that means that there is a match of the short string in the long string and the count should be
            //incrementd
            if (j === short.length - 1) count++;
        }
    }
    //after the long string has been looped through return count
    return count;
}

//////////////////////////////////////////////////////////////////////////////////////

//  //simple bubble sort algo
//  const bubbleSort = (arr) => {
// //outer loop indicates how many times the loop needs to run to sort the arr. it starts at the length of the arr and decreases
// //because the larger number bubbles up with every complete loop of the inner for loop you do not need to do any 
// //comparisons for that number once it's set at the end of the array. therefore you always go one less than the new length 
// // of the outer array.
// //i dictates how many times so it will run at run at 1 and not zero because it needs to run with one left and not with 
// // zero left
//      for(let i = arr.length; i>0; i--){
//          //allows you to iterate over the array to compare the current index to the subsequent index
//          //if the current index is bigger swap it with the subsequent one
//          //you want the loop to stop when j is smaller than i-1 because i-1 is the index where you don't want to reevaluate
//          //that's because j+1 should be the end of the elements that are evaluated when it reaches that conditional, 
//          //doing so will prevent j+1 from going beyond the number of elements

//          for(let j = 0; j<i-1; j++){
//              console.log(arr,arr[j],arr[j+1]);
//              if(arr[j]>arr[j+1]){
//                 // stores the current index of the inner loop in  temp
//                  let temp = arr[j];
//                  //if it's bigger store subsequent element in current element
//                  arr[j] = arr[j+1];
//                  //assign current element in subsequent one
//                  arr[j+1] = temp;
//              }
//          }
//      }
//     //after all the loop has completed return the sorted array
//      return arr;
//  }
// es15 method of bubbleSort algo
//bubble sort has a polynomial run time of 0(n^2) but can be a linear runtime of 0(n) if it starts out mostly sorted.
const bubbleSort = (arr) => {
    // create noSwaps variable to determine if there were any swaps during the inner loop
    let noSwaps;
    //function used to swap j and j+1 in the arr
    const swap = (arr, idx1, idx2) => {
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    };
    //setting i at arr.length allows for working down the array so that j does not count the most recently 
    // sorted element at the end, i is essentially the number of elements that need to be sorted 
    // when that counts down j knows not to count that most recently sorted number 
    for (let i = arr.length; i > 0; i--) {
        // set to true in case the array is completely sorted and the conditional below just needs to run once
        noSwaps = true
        // prevents count last sorted element, doing so also prevents the loop from going out of the array with j+1
        for (let j = 0; j < i - 1; j++) {
            //if the current element is larger call the swap function to swap the two elements
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
                //set to false due to swap made after the inner loop finishes
                // if a swap is made continue the outer loop if not break below
                noSwaps = false;
            }
        }
        // if the array is mostly sorted you don't want the algo to run needlessly,
        //to prevent that, you determine if there were swaps the previous iteration in the outer loop. if that is the case that means that the array has been sorted, and the algo should end
        // this conditional runs after every iteration of the outer loop essentially
        if (noSwaps) break
    }
    return arr
}
//////////////////////////////////////////////////////////////////////////////////////

//selectionSort algo with quadratic time complexity of 0(n^2) 
//establishes the lowest as the initial index, then compares every other element iteratively and if a small value is found
//it will swap the values by referencing the indexes.
//the inner loop does not compare the previous or current index by adding one to i in the outer loop.
//i moves the comparison along and the inner loop does the comparing

const selectionSort = (arr) => {
    // create noSwaps variable to determine if there were any swaps during the inner loop
    let noSwaps;
    for (let i = 0; i < arr.length; i++) {
        //store the index of the lowest element
        let lowest = i;
        //function used to swap i and lowest in the arr
        const swap = (arr, idx1, idx2) => {
            [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        };
        //i+1 because you don't want to compare i to itself or to what has already been sorted
        for (let j = i + 1; j < arr.length; j++) {
            // demonstrates that you compare each iteration in j to every one iteration of the outer loop i
            console.log(i, j)
            //compare arr at lowest to arr at j. if j is smaller you store index of j in lowest
            if (arr[j] < arr[lowest]) {
                //assign j to lowest
                lowest = j;

            }
        }
        //old way of swapping
        // let temp =arr[i];
        // arr[i]=arr[lowest];
        // arr[lowest] = temp;
        //after the completion of each inner loop you call swap function to assign the lowest number to the 
        // index at the current iteration of i
        //every pass will be a new iteration of i which will then store the new lowest number in that iteration of i
        // if the lower indexes in the array are presorted to prevent the lowest amount being equal to i and having a pointless swap 
        if (i !== lowest) swap(arr, i, lowest)

    }

    return arr;
}
////////////////////////////////////////////////////////////////////////////////////////
//insertion sort algo
//sort the left half as you iterate through with the current element
//essentially you compare the previous element with the current one.
//if it is bigger, you swap. do this until the previous element is smaller
//quadratic time complexity
const insertionSort = (arr) => {
    for (let i = 1; i < arr.length; i++) {
        //keep track of the current element
        let currentVal = arr[i];
        // you want to compare i to the previous element so you start j at i-1
        //j will never start at zero because i starts at 1. it's ok to go to zero because the index starts there
        // and if arr[j] is greater than currentval, breaks out of loop if that is not the case
        //the currentVal is then inserted into j+1 if it breaks out of loop because it doesn't match that conditional
        //use var to get out of lexical scoping bound by let
        for (var j = i - 1; j >= 0 && arr[j] > currentVal; j--) {
            //compare the current value of i to every value in j and do so till j reaches zero
            currentVal < arr[j]
            //if the value is of the element at j is greater you move it up to the current spot that j+1 is at in the iteration
            //because as you proceed down the iteration in the inner loop you are comparing every j element to the i element
            //which means that i is moving down the array but is being represented by j+1. and if it fits the conditional it
            //moves up to the j+1 spot. if not you insert arr[i] into that spot
            arr[j + 1] = arr[j]
        }
        //if currentval is bigger it breaks out of the loop and is inserted into j+1
        arr[j + 1] = currentVal
    }
    return arr;
}
///////////////////////////////////////////////////////////////////////////////////////
//mergeSort algo with a runtime of 0(nlogn) which is 2 to what power gives you the number of elements that you split
//into gives you log n decompositions
// n is the comparisons when merging with the merge algo
//has a space complexity of 0(n) because of the number of arrays that need to be stored
//works by breaking an array into individual elements in their own arrays
//the idea is that one or no elements in an array is sorted in itself
//you therefore merge these sorted arrays and sort them as you merge them back up to the original array
//when merging if the if the value in the first array is smaller than the one in the second push it onto the 
//new array and continue in the first array
//if the value is larger push the value in the second array into the new array and continue in the second array
//you essentially compare the value in array with the smaller value with the value in the other array. that value 
//is compared to until it is smaller, and you then flip to the other and so on.
//because of that approach you're constantly going about the arrays with the smaller side
// compare to the larger side. if you've exhausted one array, push the remaining values in the other array in the array
// that works because the side that is exhausted is smaller than the remaining sorted values on the other array
const mergeSort = (arr) => {

    const merge = (arr1, arr2) => {
        //sorted array
        let results = [];
        //pointers for the indexes of the arrays
        let i = 0;
        let j = 0;
        while (i < arr1.length && j < arr2.length) {
            //if element in first array is smaller, push onto new array
            if (arr1[i] < arr2[j]) {
                results.push(arr1[i]);
                //increase i and reenter while loop to compare again with previous j
                i++;
            }
            else {
                //else if element in second array is smaller, push onto new array
                results.push(arr2[j]);
                //increase j and reenter while loop to compare again with previous i
                j++;
            }
        }
        //if one loop has completed you must finish adding the other loop to the results array
        //this will run if i is less than the length of arr1
        while (i < arr1.length) {
            results.push(arr1[i])
            i++
        }
        // this will run if j is less than the length of arr2
        while (j < arr2.length) {
            results.push(arr2[j])
            j++
        }
        //return new array
        return results
    }
    //edge case for this recursive function
    //if the array is less than or equal to 1, return the arr and the recursion will stop
    //the recursion works by having the left proceed all the way down till it reaches the edge case
    //right has to wait until the left returns an edge case before it can proceed,
    //once each returns an edge case merge(left, right)
    if (arr.length <= 1) return arr;
    //find the midpoint of the array, and every subsequent array that is divided via recursion in this function 
    let mid = Math.floor(arr.length / 2)
    //assign the left half
    // mergeSort(left) call recursively which divides it by two until you reach the edge case
    //left progresses all the way to the edge case until it returns something
    let left = mergeSort(arr.slice(0, mid));
    //assign the right half
    //mergeSort(right) call recursively which divids it by two until you reach the edge case
    //right recursion has to wait for left recursion to reach the edge case before it can proceed
    let right = mergeSort(arr.slice(mid));
    return merge(left, right)
}
//RUN DOWN OF RECURSION
//mergesort([10,24,76,73])
//mid divides it into [10,24] and [76,73]
//left= mergeSort[10,24] runs first, right waits with [76,73]
//mid again divides into [10] and [24]
//left =mergeSort([10]) right waits with [24]
//edge case met and [10] returns and is assigned to left
//right runs now
// right = mergeSort([24])
//edge case met and [24] returns and is assigned to the right
//now left and right have finished their recursion and the func can proceed
//now run the merge function on the two returned arrays merge([10],[24])
// [10,24] is returned all the way back to the left that has left = mergeSort([10,24]) run and now assigned to left
// now right side [76,73] of the initial mid can run
//mid again divides it into [76] and [73]
//left is run left=mereSort([76]) while right waits to run [73]
// edge case is met and returns [76] and is assigned to the left
//now right runs right = mergeSort([73])
// edge case is met and returns [73] and is assigned to right
// now left and right have finished their recursion and the func can proceed
//now run the merge function on the two returned arrays merge([76,73])
//[73,76] is returned all the way back to the right variable that has right = mergeSort([76,73])
//now that the recursion has completed for both left and right
//run the merge function on left and right merge([10,24],[73,76])
//[10,24,73,76] is returned to mergeSort([10,24,76,73]
/////////////////////////////////////////////////////////////////////////////////////
//quickSort algo has a best complexity of 0(nlogn) because it will break it down by logn base 2 and compare to each 
//element of n. worst is 0(n^2) if it is already sorted because it will take the each pivot 
//point n and compare to each element n. this happens if the pivot is the minimum or maximum in every call  
//point and compare it to every element
//use a pivot helper function to
//the pivot helper picks a number and places numbers greater than it unsorted to the right
//and places smaller numbers unsorted to the left
//ideally you want to pick an element to pivot from that is in the middle value wise
//once you parse out the left and right side of the pivot you return the index of that pivot
//quickSort algo works by calling the pivot helper function on the array recursively
//it calls the pivot function on the left and right until it gets to the point where the left and right are equal or if the right is less than. That happens when a subarray has less than two elements 

//quicksort uses the pivot helper function to recursively find the pivotIndex for the initial and subsequent subarrays that result from the pivotIndex for every call
//base case is when the left and right are equal or when the right is less than the left
//have a left and right parameter to indicate where to start and end for the subarrays when the function is called recursively on subsequent arrays that are passed to it
//it gets sorted with every call due to the helper function pivot that slowly sorts with every recursive run due to the function sorting larger and smaller. it will eventually sort smaller and smaller subarrays to the point where there is just one element left
const quickSort = (arr, left = 0, right = arr.length - 1) => {
    //set the start and end of the array that you're finding the pivot for, this will
    // indicate when to stop for the subarray when you start breaking the left and right sides of the array up. especially when it is done recursively 
    //when called recursively on an array it will slowly sort the array 
    const pivot = (arr, start = 0, end = arr.length + 1) => {
        // set the pivot to start at the 0 index
        let pivot = arr[start]
        //set the swpIndx. that is what you're going to swap the pivot element to at the end
        //it tells you how many elements that are smaller than the pivot
        let swpIndx = start

        //helper swap function
        const swap = (arr, idx1, idx2) => {
            [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        };
        //loop through the array to sort around the pivot. you do not need to start at the
        //beginning because that is where the pivot starts so start the loop at start+1
        for (let i = start + 1; i < arr.length; i++) {
            //if pivot is greater than the value of arr[i] then you swap arr at swpIndx 
            //with the current index of i
            if (pivot > arr[i]) {
                //increase swpindx to track index where pivot needs to be inserted
                swpIndx++
                //swap the current element at i with the swpIndx because that is where the smaller value will be when pivot is eventually inserted
                swap(arr, swpIndx, i)
            }
        }
        //when the smallest value has been sorted to the left of the pivot, call the swap
        //function to swap the start at zero with the swpindx because that is where
        //it should be at. the current element at swpindx will be smaller because it has been sorted to the spot
        swap(arr, start, swpIndx)

        return swpIndx
    }

    //the base case is when the left and right equal the same index of zero
    //it will run until then. That is because you're looking at the full array everytime
    //but the left and right are constantly changing with everymid point move the left and right get smaller
    //one thing to keep in mind is that even on the right, what is passed into the left parameter is the new left for that new subarray.
    //get the pivotIndex for the array by calling the pivot helper function
    //get the pivotIndex for each recursive subarray be it from the left or right of the pivotIndex
    if (left < right) {
        let pivotIndex = pivot(arr, left, right);
        //recursively call the quicksort function on the left side to then find the pivotIndex and subsequently have the left and right to sort as well
        //pass the array, the start and the pivot index minus when for where the left stops
        quickSort(arr, left, pivotIndex - 1);
        //when the recursion for the left side completes you move on to the right
        //pass in the the arr, the pivotIndex+1 and arr.length-1 for the end
        quickSort(arr, pivotIndex + 1, arr.length - 1);
    }
    return arr;
}

//quicksort([3,10,1,9])
//left 3 smaller than right 9
//pivotindex requires pivot function call pivot([3,10,1,9],0,4)
//swpindx is 3 which is smaller than 5 so nothing changes
//1 is smaller than 3 so swpindx increases by one swap function is called swap([3,10,1,9],1,2)
//[3,1,10,9] 10 is bigger than 3 so nothing changes and it exits loop
//swap function is called to swap swpindx 1 with start 0 swap([3,1,10,9],1,0)
//which ends up being  1,3,10,9 and returns pivotindex of 1
//with new pivotindex set of 1
//recursively call to sort the left side quicksort ([1,3,10,9],0,0)
//left and right are equal indexes
//conditional is not met so it returns arr  1,3,10,9
//continues to recursively call quicksort([1,3,10,9],2,3) to sort right side
// left is arr[2] 10 and right is arr[3] 9 so therefore meet the conditional
//assign pivotindex by calling pivot([1,3,10,9],2,3)
//pivot is 10 and swpindx is 2 and enter for loop
//arr[3] is 9 and 10 is bigger than 9 so swpindx is increased and you 
//call the helper function with 3 and 3 for the indexes swap([1,3,10,9],2,3) which returns the same array
//after the loop you call swap([2,3,10,9],2,3) with start of 2 and swpindx of 3 and
// which ends up with 1,3,9,10 and returns the swpIndx of 3
//which then leads to the recursive call of the left side with quickSort([1,3,9,10],2,2)
//condition is not met so return arr to the previous quicksort of the right side
//returns all the up the stack to the original quicksort on the right call 
// which returns with a sorted array of [1,3,9,10]
// which then returns that array

/////////////////////////////////////////////////////////////////////////////////////////////
//Radix sort uses base 10 to sort a number array
//arrange from ones, tens, hundreds and so forth 
//it takes place each base ten at a time
//whatever number is in each base ten spot will be grouped into 0-9 buckets
// each one is an array inside a bigger array
//after each grouping, each index from bottom up is emptied out back into the array
//this is done until the last base 10 spot is fulfilled

// you need a helper method to assist in grabbing the number in each base 10 spot
const getDigit = (num, i) => {
    return Math.floor(Math.abs(num) / Math.pow(10, i) % 10)
}
//you need a helper function/method to help determin how many digits in a number 
const digitCount = (num) => {
    if (num === 0) return 1
    // math.log10 is returns* the number that is needed to equal ten. you floor that and add 1
    return Math.floor(Math.log10(Math.abs(num))) + 1
}
//helper function to figure out the largest number of digits you need to count to passing the number array to the digitCount function
const mostDigits = (nums) => {
    let maxDigits = 0;
    for (let i = 0; i < nums.length; i++) {
        //math.max gives you the larger number between two numbers
        maxDigits = Math.max(maxDigits, digitCount(nums[i]))
    }
    return maxDigits
}

//radixSort algo has time complexity of 0(nk) can be compared to nlogn at timesy7
//the idea behind it is that each bucket will be assigned numbers based on the digit, but the sort is based on the
//based 10 spot. it works to sort for example because [2,1], 1 and 2 at the ones spot will sit in different 
//indexs of 1 and 2
//therefore when you concat the two, it concats as [1,2] because that is because the buckets will only be further filled
//if you have higher base 10 digits. therefore if you were looking at [1,11,2] at the tens spot 1 and 2 would be zero and
//be placed in the first index of 0 and 11 would be placed at 1. basically the previous digit at the base 10 spot 
//sorts the number, if the next base 10 spot is nonexistent it will be assigned zero and is placed there
// every iteration the order gets more sorted because the larger numbers get further up based on the base ten spot
const radixSort = (nums) => {
    // calls helper fu nction to determine maxDigits  
    let maxDigitCount = mostDigits(nums);
    //loop through the length of maxDigitCount to loop from 0 to one less than the length of the array
    //this is the 10 based approach to finding which ten spot you're in k represents the log10 number
    for (let k = 0; k < maxDigitCount; k++) {
        //create a variable to store the buckets for 0-9. use the Array.from method to create an array of empty buckets
        //with a length of ten
        let digitBuckets = Array.from({ length: 10 }, () => [])
        //within the outer loop, now loop over the numbers of the nums with nums.length 
        //get the digit within the number of nums[i] located at the iterated index in k by calling the getdigit function
        //essentially grab the spot within the base 10 k spot for each number of nums that you iterate through
        for (let i = 0; i < nums.length; i++) {
            let digit = getDigit(nums[i], k);
            //put the nums[i] number into the appropriate bucket based on it's based ten digit. this digit will be the
            //index in the digitBuckets array. you do so by first indicatin digit/index that is returned from getDigit
            //that digit/index represents an array/bucket.
            //you then push the number from nums[i] into that bucket
            digitBuckets[digit].push(nums[i]);
        }
        //after every iteration in the outer k loop, you must recombine the array from the buckets going from 0-9
        //the best approach to doing that is to concat the buckets together using a spread operator on digitbuckets
        //if you try to concat the arrays separately the newer sorted array will still have separate arrays rather 
        //than just simple numbers
        //you do that by using [].concat and you pass in digitbuckets using the spread operator as such ...digitbuckets
        //after doing taht you assign it to the nums array, which will result in it being slightly more sorted
        //you do this until the outer k base 10 digits reaches it's condition of maxDigitCount length
        nums = [].concat(...digitBuckets);
    }
    return nums
}

//radixSort([100,3,45])
//mostDigits function returns 3
//outer loop tracks base ten based on mostDigits 
//k is 0 
//every time the loop runs you create an empty array of buckets so that you can place numbers from nums
//inner loops runs to loop through the elements/numbers in nums. the first number is 100  
//run the getDigits function to determine the digit. by passing in i which is 100 and k which is 0
//0 is returned and placed in the array of buckets that was created by the outer loop. this array of buckets
//will persist until the next iteration of k
//the number of 100 with the digit 0 is placed at the index that reflects its number of 0 
//i iterates to the next number 3, that calls getDigit(3,0) and returns 3
// the number 3 with the digit 3 is placed at the index that refeclts its number of 3
//45 gets placed at 5 and the loop completes
//concats the array 100,3,45
//k iterates and creates a new digitbuckets
//inner loop runs and 100 is placed at 0
//3 is placed at  0  
//45 is placed at 4
//concats again 100,3,45
//outerloop runs run last time
//creates new digit buckets
//innerloop runs 100 is placed at 1
//3 is placed at zero
//45 is placed at zero
//concats 3,45,100
/////////////////////////////////////////////////////////////////////////////////////
//singly linked list
//piece of data will be - val
//referencing the next node will be - next

//define the class called Node
class Node {
    constructor(val) {
        //'this' is the instance of the node class, basically this is referring to the key for each instance
        this.val = val;
        //referring to the tail of the linked list, because in the beginning nothing comes after the initial val
        this.next = null;
        //
    }
}
//create a node
//let first = new Node('hi')
//add a node by creating a new node and assigning it to .next property of first
//when that happens .next will have a this.val of there and a property of next that is set to null
//you can assign more nodes by adding to this chain of .nexts. Nodes are added in this fashion.
//first.next = new Node('there')
// this will be the next property of the node assigned to first.next.next
//first.next.next = new Node('where')
//this will be the next property of the node assigned to first.next.next.next
// first.next.next.next = new Node('here')

//define a class so that it can instantiate and add or remove nodes rather than using the brute force approach just 
//demonstrated above
class SinglyLinkedList {
    // takes no arguments
    //linkedlist has a pointer to the head and tail
    //and it provides a length
    //the constructor provides a framework for a linklist using the Node class from above to fill it in
    constructor() {
        //initialized with head and tail to the node, every subsequent node is added to the tail
        this.head = null;
        //every node afterwards is push onto tail and just like above chains downwards everytime
        this.tail = null;
        this.length = 0;
    }
    //push method calls the node class from above to start a initiate a linkedlist
    push(val) {
        //head and tail created with initial node. 
        //next node will have tail point to a new tail and have the new node assigned to it.
        //increase the length by one every time
        //create a new node passing the val in that will be the new node
        let newNode = new Node(val);
        //set the edge case for if there is no head or tail
        if (!this.head) {
            //point head to the newNode
            //head.next can be called because tail and head point to the same start/node to the list
            this.head = newNode;
            //because the newNode will have the head and tail be the same, point head to the tail.
            //tail is essentially pointing to the newNode 
            //tail is pointing to head
            this.tail = this.head;
        }
        // if the head isn't empty add on to the tail by assigning
        //because tail is essentialy the newNode it will have access to the properties in the node class
        // so therefore with any subsequent node passed to it tail will point to the  value and have
        // have the empty property this.next where you can call and chain subsequent tails to
        else {
            //head points to the list of the nodes, with every subsequent one added on via th e .next property in the node class
            //that is done because tail has access to it via newNode being an instance of that class
            // due to the rules of object referencing this.tail.next references the newNode that this.head pointed to. and it will continue to point to it every time
            //this.tail.next references this.head which references newNode
            // continues the chain
            //it's pointing to newNode from the previous tail therefore continuing the list
            // hello points to bye

            this.tail.next = newNode;
            //the tail gets pointed to the newest node but next is a continuation of the previous pointers pointing
            //at the previous nodes
            //tail points to bye
            //tail points to the newest node
            //so when you push again tail.next will use that node to push to the newest node, and the cycle repeats
            //the best way to look at it is that the next and tail are connected in memory. bye is now the tail in memory. but hello before that points to bye. so if another value is entered bye.next will point to that, and that val will have the tail pointing to it until the end where .next points to null.
            //tail.next->to tail->tail.next->to tail...etc
            this.tail = newNode;
        }
        //increase the length
        this.length++;
        // this is the instantiated object/list
        return this;
    }
    //delete last time
    //edge case, if there are no nodes return undefined
    //find second to last item and set the next property to point to null0
    //find second to last item and set as tail
    //return the value of the node that was removed
    pop(val) {
        //if there is no head then the list is empty and you return undefine
        if (!this.head) return undefined;
        //two variable in the loop. previous and current. previous is what will be the tail
        //both will point at head, then you move current up, if current isn't the end you move previous up to current
        // if current is the end of the tail, you set previous.next to null and set previous to the new tail.
        let current = this.head;
        // previous is assigned current because they will both be at the head
        let previous = current
        //while loop will run as long as current.next is not pointing to null. if so you have found the tail and it will stop running
        //otherwise while it is pointing to current.next and it isn't null you assign the current to previous
        //essentially moving it up to the current spot
        //and moving current up to current.next 
        while (current.next) {
            //current is assigned to previous, moving previous up
            previous = current;
            // the next current is assigned to the current one
            current = current.next;
        }
        // when the loop is complete it is because current.next is pointing to null
        //which means that because the code above didn't run, current would be at the end and previous would be at the previous spot
        //at this point previous is the desired new tail
        //this means you just point previous to this.tail and assign null to this.tail.next and 
        //decrement length by one
        //return current which is the severed node
        //set the second to last node whic is previous to tail
        this.tail = previous;
        //set null to this.tail.next, this will sever the connection to the last node
        this.tail.next = null;
        //decrement length by one
        this.length--;
        //if there is one node left and it is deleted, the linkedlist will still indicate an existent of it pointing to
        //a node. to prevent this set conditional for length of the list. 
        if (this.length === 0) {
            this.head = null;
            this.tail = null;
        }
        //return the severed node
        return current
    }
    // traverse(){
    //     // start of the list this.head is assigned to current
    //     let current =this.head
    //     //while there is a current that is pointed to
    //     while(current){
    //         //current is pointed to by current.next, therefore the next.current is assigned to current
    //         //if the last pointed to current is null you exit the loop
    //         current = current.next 
    //     }
    // }
    //shift method deletes node from the head
    //if there are no nodes, return undefined
    //store the current head property in a variable
    //set the head property to be the current head's next property
    //decrement length by 1
    //return value of removed node
    shift() {
        // empty list
        if (!this.head) return undefined;
        let current = this.head;
        //remove the head by assigning the current head's next property to this.head
        this.head = current.next;
        //decrement length
        this.length--;
        //if there is one node left and it is deleted, the linkedlist will still indicate an existent of it pointing to
        //a node. to prevent this set conditional for length of the list. 
        if (this.length === 0) {
            this.head = null;
            this.tail = null;
        }
        //return severed node
        return current;
    }
    //unshift method adds node at the head
    //function accepts a value
    //creates a new ode using the value passed in
    //if there is no head property, set the head and tail to the new node
    //else set the new node's next property to be the current head property on the list
    //set the head property property on the list to be the newly created node
    //increment the length
    //return the list
    unshift(val) {
        let newNode = new Node(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = this.head;
        }
        //else is need on an empty list otherwise it will continue with the if logic in the next 
        //lines, so it will point the new node next property to the head then sets the  
        //head to the new node, this makes adding a new node broken because next will point to 
        //the new node 
        //the else statement makes it so that the code only runs when there is at least one node
        else {
            //point the newNode at the current head
            newNode.next = this.head
            //update the head by pointing it to the newly created node
            this.head = newNode;
        }
        //increment length
        this.length++
        //return the list
        //this is the currently created list
        return this
    }
    //time complexity of 0(n)
    //method to retreive a node by it's index/position in the list
    //if the index is less than zero or greater than or equal to the length of the list, return null
    //using the counter variable, loop through the list until you reach the index and return the
    //node at that specific index
    get(index) {
        //return null if index is out of range
        if (index < 0 || index >= this.length) return null;
        //variable to keep track of loop
        let count = 0;
        //current starts off at the head
        let current = this.head;
        //runs while count doesn't equal index. The moment it does it will jump out of the loop
        while (count !== index) {
            //at the index that count is at grab the node that current.next is pointing to and assign it to current
            current = current.next
            count++;
        }
        //when count equals index you exit the loop
        //when it was one back it pointed to this via the next property so when count incremented it jumped out of the
        //loop. The current is now at the index.
        //return the current node
        return current;
    }
    // time complexity 0(n)
    //set accepts a value and an index that places the value at that index
    //use 'get' function to find the specific node
    //if the node is not found return false
    //if the node is found, set the value of that node to be the value passed to the function and return true
    set(index, val) {
        //call the get method to get the value of the node at the index and assign it to the variable
        let foundNode = this.get(index)
        //if it's found just assign the val that is passed in to this method to the foundNode.val which will
        //update its value to val.
        //return true if it's found and updated
        if (foundNode) {
            foundNode.val = val;
            return true;
        }
        //if a node is not found, return false
        return false

        return val;
    }


    //insert method constant time complexity of 0(1)
    //if the index is less than zero or greather than the length, return false.
    //create the node
    //if the index is the same as the length, 'push' a new node to the end of the list
    //if the index is 0, unshift a new node ot the start of the list
    //find the index before the actual index, so use the 'get'method and pass in the index -1
    //set the next property on that node to be the new node 
    //set the next property on the new node to the be the previous next, which means assign the next on the new node to the node on the node before it so that it could point to the one that comes afterwards
    insert(index, val) {
        //check to see if it's less than zero or greater than the length
        if (index < 0 || index > this.length) return false;
        //pushes to the end, push returns list to this method, therefore you need to return the results 
        //want to return a boolean so use double !! to show its boolean truthy state
        if (index === this.length) return !!this.push(val);
        //inserts at the beginning. use !! to show its truthy state
        if (index === 0) return !!this.unshift(val);
        let newNode = new Node(val);
        //else insert it in the middle of the list by using the get method which returns the node right before the index, 
        //and assign it to the previous variable
        let previous = this.get(index - 1);
        // create a temp variable to store what previous next is pointing to
        let temp = previous.next
        //point previous.next to the newNode
        previous.next = newNode
        //point newNode.next to the node that previous.next pointed to to complete the insert
        newNode.next = temp
        //increase length
        this.length++;
        //indicate it works;
        return true;
    }


    //remove method, constant time complexity of 0(1) or 0(n), deletes node from list 
    //if the index is less than zero or greater than the length return undefined
    //if the index is the same as the length-1, pop
    //if the index is 0, shift
    //otherwise use the 'get' method, access the node at the index-1
    //set the next property on that node to be the next of the next node
    //decrease length
    //return the removed node
    remove(index) {
        //less than zero or greater than the length of the list return undefined
        if (index < 0 || index > this.length) return undefined;
        //equal to the length call the pop method to delete the last node
        if (index === this.length - 1) return this.pop();
        //index is 0 call the shift method and delete the head
        if (index === 0) return this.shift();
        //call get method to access the node before the index and assign it to a variable
        let previousNode = this.get(index - 1);
        //store the node that is pointed to but will be removed
        let removedNode = previous.next;
        //to remove the node just point previous.next to the removed nodes .next 
        previous.next = removedNode.next;
        //return the removed node
        return removedNode
    }

    //helper method to visualize the reverse method
    print() {
        let arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.val)
            current = current.next
        }
        console.log(arr)
    }

    //reverse method
    //reverse the list head to tail, goes to tail to head
    //swap the head and tail
    //create a variable called next
    //create a variable called prev
    //create a variable called node and initialize it to the head property
    //loop through the list
    //set next variable to be the next property on whatever the current node is to store what it is currently pointing at
    //set the next property on the current node to be whatever the prev is, this is the start of the reversing of the list
    //set prev to be the value of the current node variable, assigning what is currently the node to the previous spot in preparation for the loop to increment the index to the next node
    //set the node variable to the value of the next variable, the next variable stores what the current node is pointing at, therefore you assign what is the next node to the current node spot 
    reverse() {
        //current node
        let node = this.head;
        //assign tail to the head
        this.head = this.tail;
        //assign the current node to the tail
        this.tail = node;
        let next;
        //create a previous variable and set it to null because you want to make sure that the end of the tail.next is pointing to null
        let prev = null;
        //loop through the list
        for (var i = 0; i < this.length; i++) {
            // keeps track of what the current node is pointing to so that you can move onto it
            next = node.next;
            //set the next property on the current node to point to whatever the prev is, this is the start of the reversing of the list
            node.next = prev;
            //set prev to be the value of the current node variable, assigning what is currently the node to the previous spot in preparation for the loop to increment the index to the next node
            prev = node;
            //set the node variable to the value of the next variable, the next variable stores what the current node is pointing at, therefore you assign what is the next node to the current node spot 
            node = next;
        }
        return this;


    }



}


//list will be empty
let list = new SinglyLinkedList();
//list.push will create the initial node
list.push('hello')
//pushing a subsequent node will link to hello node by assigning goodbye to tail.next 
//tail with then point to the new node
list.push('goodbye')
list.push('see you')
// list.pop()
// list.shift()
// list.unshift('hello')
list.get(0)
console.log(list.reverse())





//////////////////////////////////////////////////////////////////////////////////////
// print object to dom
// document.querySelector('.algo').innerHTML=`The count is: ${JSON.stringify(charCount('Titan!!'))}`;
// docum ent.querySelector('.algo').innerHTML=same([1,2,3],[1,4,9,])
// document.querySelector('.algo').innerHTML=validAnagram('cinema','iceman')
// document.querySelector('.algo').innerHTML=sumZero([-4,-3,-2,1,0,1,2,3,10])
// document.querySelector('.algo').innerHTML=countUniqueValues([-4,-3,-2,-1,0,1,2,3,10])
// document.querySelector('.algo').innerHTML=maxSubarraySum([-4,-3,-2,-1,0,1,2,3,10],4)
// document.querySelector('.algo').innerHTML=maxSubarraySum([-4,-3,-2,-1,0,1,2,3,10],4)
// document.querySelector('.algo').innerHTML=countDown(5)
// document.querySelector('.algo').innerHTML=factorial(5)
// document.querySelector('.algo').innerHTML=JSON.stringify(collectOdds([1,2,3,4,5]))
// document.querySelector('.algo').innerHTML=binarySearch([2,5,6,9,13,15,28,30],2)
// document.querySelector('.algo').innerHTML=naiveSearch('lorie loled', 'lol')
// document.querySelector('.algo').innerHTML=JSON.stringify(bubbleSort([8,1,2,3,4,5,6,7]))
// document.querySelector('.algo').innerHTML=JSON.stringify(selectionSort([34,22,10,19,17]))
// document.querySelector('.algo').innerHTML=JSON.stringify(insertionSort([2,1,9,76,4]))
// document.querySelector('.algo').innerHTML=JSON.stringify(mergeSort([10,24,76,73]))
// document.querySelector('.algo').innerHTML=JSON.stringify(quickSort([4,6,9,1,2,5,3]))
// document.querySelector('.algo').innerHTML = JSON.stringify(radixSort([4, 6, 9, 1, 2, 5, 3]))