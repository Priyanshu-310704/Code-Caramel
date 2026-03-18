const fs = require('fs');
const path = require('path');

const difficulties = ["easy", "medium", "hard"];
const sheets = [
  "LeetCode Top 100", 
  "Codeforces Basics", 
  "Dynamic Programming Masterclass", 
  "Graph Theory Algorithms", 
  "Blind 75", 
  "Company Specific - Google"
];

function generateProblem(index) {
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const sheet = sheets[Math.floor(Math.random() * sheets.length)];
  const title = `Generated Algorithm ${index}`;
  
  return {
    title: title,
    description: `This is an auto-generated algorithmic problem designed to test your core computer science fundamentals. Solve it optimally.\n\n**Input Format**\n- The first line contains an integer \`N\`, representing the size of the dataset.\n- The second line contains \`N\` space-separated integers.\n\n**Output Format**\n- Return a single integer representing the optimal solution.\n\n**Example 1:**\n\`\`\`\nInput:\n5\n1 2 3 4 5\n\nOutput:\n15\n\`\`\`\n\n**Example 2:**\n\`\`\`\nInput:\n3\n-1 0 1\n\nOutput:\n0\n\`\`\`\n\n**Constraints**\n- \`1 <= N <= 10^5\`\n- \`-10^9 <= Arr[i] <= 10^9\``,
    difficulty: difficulty,
    sheet: sheet,
    testCases: [
      {
        input: "5\n1 2 3 4 5",
        output: "15"
      },
      {
        input: "3\n-1 0 1",
        output: "0"
      }
    ],
    codeStubs: [
      {
        language: "CPP",
        startSnippet: "#include <iostream>\n#include <vector>\nusing namespace std;\n",
        endSnippet: "\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> arr(n);\n    for(int i=0; i<n; i++) cin >> arr[i];\n    cout << solve(arr) << endl;\n    return 0;\n}",
        userSnippet: `int solve(vector<int>& arr) {\n    // Code for ${title}\n    return 0;\n}`
      },
      {
        language: "JAVA",
        startSnippet: "import java.util.*;\n\nclass Main {\n",
        endSnippet: "\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for(int i=0; i<n; i++) arr[i] = sc.nextInt();\n        System.out.println(solve(arr));\n    }\n}",
        userSnippet: `    public static int solve(int[] arr) {\n        // Code for ${title}\n        return 0;\n    }`
      }
    ]
  };
}

function main() {
  const originalDataPath = path.join(__dirname, 'data.json');
  const existingData = JSON.parse(fs.readFileSync(originalDataPath, 'utf8'));
  
  const generatedProblems = [];
  for (let i = 1; i <= 100; i++) {
    generatedProblems.push(generateProblem(i + existingData.length));
  }
  
  const allProblems = [...existingData, ...generatedProblems];
  
  fs.writeFileSync(originalDataPath, JSON.stringify(allProblems, null, 2));
  console.log(`Successfully generated 100 new problems and appended them to data.json`);
  console.log(`Total problems now in database: ${allProblems.length}`);
}

main();
