const arraySize = 10;
const arrayContainer = document.getElementById('array-container');
let array = [];

function generateRandomArray() {
    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * arrayContainer.clientHeight));
    originalArray = [...array];
    renderArray();
}

function resetArray() {
    array = [...originalArray]; // Restore the original array
    renderArray();
}
function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach(height => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${height}px`;
        arrayContainer.appendChild(bar);
    });
}

async function sortArray(sortFunction) {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = '#3498db'; // Reset color
    }

    await sortFunction();

    bars.forEach(bar => bar.style.backgroundColor = '#2ecc71'); // Final color
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSelectionSort() {
    await sortArray(async () => {
        for (let i = 0; i < array.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
                updateVisualization([i, minIndex]);
                await sleep(500);
            }
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            updateVisualization([i, minIndex]);
            await sleep(800);
        }
    });
}

async function startInsertionSort() {
    await sortArray(async () => {
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
                array[j + 1] = key;
                updateVisualization([j + 1, i]);
                await sleep(500);
            }
        }
    });
}

async function startBubbleSort() {
    await sortArray(async () => {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                }
                updateVisualization([j, j + 1]);
                await sleep(500);
            }
        }
    });
}

async function startMergeSort() {
    await sortArray(async () => {
        async function mergeSort(start, end) {
            if (start >= end) return;
            const mid = Math.floor((start + end) / 2);
            await mergeSort(start, mid);
            await mergeSort(mid + 1, end);
            await merge(start, mid, end);
        }

        async function merge(start, mid, end) {
            const left = array.slice(start, mid + 1);
            const right = array.slice(mid + 1, end + 1);
            let i = 0, j = 0, k = start;

            while (i < left.length && j < right.length) {
                if (left[i] <= right[j]) {
                    array[k++] = left[i++];
                } else {
                    array[k++] = right[j++];
                }
                updateVisualization([k - 1]);
                await sleep(500);
            }

            while (i < left.length) {
                array[k++] = left[i++];
                updateVisualization([k - 1]);
                await sleep(500);
            }

            while (j < right.length) {
                array[k++] = right[j++];
                updateVisualization([k - 1]);
                await sleep(500);
            }
        }

        await mergeSort(0, array.length - 1);
    });
}

async function startQuickSort() {
    await sortArray(async () => {
        async function quickSort(start, end) {
            if (start >= end) return;
            const pivotIndex = await partition(start, end);
            await quickSort(start, pivotIndex - 1);
            await quickSort(pivotIndex + 1, end);
        }

        async function partition(start, end) {
            const pivot = array[end];
            let i = start;
            for (let j = start; j < end; j++) {
                if (array[j] <= pivot) {
                    [array[i], array[j]] = [array[j], array[i]];
                    updateVisualization([i, j]);
                    await sleep(500);
                    i++;
                }
            }
            [array[i], array[end]] = [array[end], array[i]];
            updateVisualization([i, end]);
            await sleep(500);
            return i;
        }

        await quickSort(0, array.length - 1);
    });
}

async function startHeapSort() {
    await sortArray(async () => {
        function heapify(n, i) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && array[left] > array[largest]) largest = left;
            if (right < n && array[right] > array[largest]) largest = right;

            if (largest !== i) {
                [array[i], array[largest]] = [array[largest], array[i]];
                updateVisualization([i, largest]);
                heapify(n, largest);
            }
        }

        for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
            heapify(array.length, i);
        }

        for (let i = array.length - 1; i > 0; i--) {
            [array[0], array[i]] = [array[i], array[0]];
            updateVisualization([0, i]);
            await sleep(500);
            heapify(i, 0);
        }
    });
}

function updateVisualization(indices) {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.backgroundColor = indices.includes(index) ? '#e74c3c' : '#3498db';
    });
    renderArray();
}

document.addEventListener('DOMContentLoaded', () => {
    generateRandomArray();
});