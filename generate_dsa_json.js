const fs = require('fs');

const rawText = `Q1. Move All Zeros to the End 
Write a program to move all the zero characters in a given string to the end while maintaining the order of non-zero characters. 
Example: 
Input: "a0b0c1" 
Output: "abc100" 

Q2. Conditional Reverse Based on Length 
Write a program to check the length of a given string. 
If the length is even, reverse the string. 
If the length is odd, print * for each character. 
Example: 
Input: "abcd" 
Output: "dcba" 
Input: "abc" 
Output: "***" 

Q3. Count Frequency of Each Character 
Write a function to count the frequency of each character in a given string using HashMap or HashSet. 
Example: 
Input: "aabbc" 
Output: 
a → 2   
b → 2   
c → 1 

Q4. Swap Array Elements in Pairs 
Write a program to swap adjacent elements of an integer array. 
Example: 
Input: {3, 2, 4, 5} 
Output: {2, 3, 5, 4} 

Q5. Find Unique Characters in a String 
Write a program to find all unique characters in a given string. 
Example: 
Input: "aabbeddc" 
Output: "ec" 

Q6. Count Gmail IDs from 2D Array 
A 2D array contains 10 email IDs. 
Write a function to count how many of them belong to gmail.com. 
Example: 
Input: 
{ 
"abc@gmail.com", 
"xyz@yahoo.com", 
"test@gmail.com" 
} 
Output: 2 

Q7. Check Anagram (2D Character Array) 
Two strings are stored in a 2D character array. 
Write a function to check whether they are anagrams. 
Example: 
Input: {"listen", "silent"} 
Output: true 

Q8. Most Repeating Character in List of Strings 
Write a function to return the most frequently repeating character from a list of strings. 
Example: 
Input: ["java", "coding", "interview"] 
Output: 'i' 

Q9. Remove Duplicate Names (2D Char Array) 
Write a function to remove duplicate names stored in a 2D character array. 
Example: 
Input: {"Ravi", "Amit", "Ravi", "Sumit"} 
Output: {"Ravi", "Amit", "Sumit"} 

Q10. Sort City Names 
Write a program to sort 10 city names stored in a 2D array. 
The names should be taken from the user. 
Example: 
Input: {"Mumbai", "Delhi", "Pune"} 
Output: {"Delhi", "Mumbai", "Pune"} 

Q11. Count Vowels in Each String 
Write a program to count the number of vowels in each of the 5 strings stored in a 2D array. 
Example: 
Input: {"Java", "Python", "Code"} 
Output: 
Java → 2   
Python → 1   
Code → 2 

Q12. Check Palindrome (Two Pointer) 
Given a string, check whether it is a palindrome using the two-pointer technique. 
Example: 
Input: "abba" 
Output: 1 

Q13. Reverse Words Separated by Dots 
Write a program to reverse the order of words in a string separated by dots. 
Example: 
Input: "i.like.this.program.very.much" 
Output: "much.very.program.this.like.i" 

Q14. Reverse a String 
Write a program to reverse a given string. 
Example: 
Input: "hello" 
Output: "olleh" 

Q15. Count Vowels and Consonants 
Write a program to count vowels and consonants in a string. 
Example: 
Input: "Interview" 
Output: 
Vowels: 4   
Consonants: 5 

Q16. Find Duplicate Characters 
Write a program to find duplicate characters in a string. 
Example: 
Input: "programming" 
Output: r g m 

Q17. Check Anagram 
Write a function to check whether two strings are anagrams. 
Example: 
Input: "listen", "silent" 
Output: true 

Q18. Create Acronym Name 
Write a function to create an acronym from a full name. 
Example: 
Input: "Ramesh Chand Tiwari" 
Output: "R C Tiwari" 
Input: "Bhavesh Gupta" 
Output: "B Gupta" 

Q19. First Non-Repeating Character 
Write a function to find the first non-repeating character in a string. 
Example: 
Input: "swiss" 
Output: 'w' 

Q20. Count Words in a String 
Write a program to count the number of words in a string. 
Example: 
Input: "I am ready" 
Output: 3 

Q21. Reverse Words in a Sentence 
Write a program to reverse words in a sentence. 
Example: 
Input: "I love Java" 
Output: "Java love I" 

Q22. Check Rotation of String 
Write a function to check whether one string is a rotation of another. 
Example: 
Input: "abcd", "cdab" 
Output: true 

Q23. Capitalize First Letter of Each Word 
Write a function to capitalize the first character of each word. 
Example: 
Input: "java full stack developer" 
Output: "Java Full Stack Developer" 

Q24. Search a Word in a String 
Write a function to check whether a given word exists in a string. 
Example: 
Input: "Java is powerful", "powerful" 
Output: true 

Q25. Reverse String Word-Wise 
Write a function to reverse a string word-wise. 
Example: 
Input: "MySirG Education Services" 
Output: "Services Education MySirG" 

Q26. Check Alphanumeric String 
Write a function to check whether a string is alphanumeric 
(at least one letter and one digit). 
Example: 
Input: "abc123" 
Output: true 

Q27. Count Alphabets, Digits & Special Characters 
Write a program to count alphabets, digits, and special characters in a string. 
Example: 
Input: "abc@123" 
Output: 
Alphabets: 3   
Digits: 3   
Special Characters: 1 

Q28. Convert Case Without Inbuilt Methods 
Write a program to convert a string to uppercase/lowercase without using inbuilt methods. 
Example: 
Input: "Java" 
Output: "JAVA" 

Q29. Count Occurrence of a Character 
Write a program to count the occurrence of a given character in a string. 
Example: 
Input: "programming", 'g' 
Output: 2 

Q30. Find Largest and Smallest Element 
Write a program to find the largest and smallest element in a given integer array. 
Example: 
Input: {4, 2, 9, 1, 7} 
Output: 
Largest = 9   
Smallest = 1 

Q31. Reverse an Array 
Write a program to reverse a given array. 
Example: 
Input: {1, 2, 3, 4} 
Output: {4, 3, 2, 1} 

Q32. Find Second Largest Element 
Write a program to find the second largest element in an array. 
Example: 
Input: {10, 5, 8, 20} 
Output: 10 

Q33. Check if Array is Sorted 
Write a program to check whether a given array is sorted in ascending order. 
Example: 
Input: {1, 2, 3, 4} 
Output: true 
Input: {3, 1, 4} 
Output: false 

Q34. Remove Duplicates from a Sorted Array 
Write a program to remove duplicate elements from a sorted array. 
Example: 
Input: {1,1,2,2,3,3} 
Output: {1,2,3} 

Q35. Find Missing Number (1 to n) 
An array contains numbers from 1 to n with one missing number. 
Write a program to find the missing number. 
Example: 
Input: {1, 2, 4, 5} 
Output: 3 

Q36. Find Duplicate Number 
Write a program to find duplicate elements in an array. 
Example: 
Input: {1, 2, 3, 2, 4} 
Output: 2 

Q37. Move All Zeros to End 
Write a program to move all zeros to the end of the array while maintaining the order of non-zero elements. 
Example: 
Input: {0, 1, 0, 3, 12} 
Output: {1, 3, 12, 0, 0} 

Q38. Find All Pairs with Given Sum 
Write a program to find all pairs in an array whose sum is equal to a given value. 
Example: 
Input: {2, 7, 11, 15}, Sum = 9 
Output: (2,7) 

Q39. Rotate Array by K Positions 
Write a program to rotate an array by k positions. 
Example (Right Rotation): 
Input: {1,2,3,4,5}, k = 2 
Output: {4,5,1,2,3} 

Q40. Maximum Subarray Sum (Kadane’s Algorithm) 
Write a program to find the maximum sum of a contiguous subarray. 
Example: 
Input: {-2,1,-3,4,-1,2,1,-5,4} 
Output: 6 

Q41. Merge Two Sorted Arrays 
Write a program to merge two sorted arrays into a single sorted array. 
Example: 
Input: {1,3,5} and {2,4,6} 
Output: {1,2,3,4,5,6} 

Q42. Sort Array of 0s, 1s, and 2s 
Write a program to sort an array consisting only of 0, 1, and 2. 
Example: 
Input: {2,0,2,1,1,0} 
Output: {0,0,1,1,2,2} 

Q43. Find Union of Two Arrays 
Write a program to find the union of two arrays. 
Example: 
Input: {1,2,3} and {3,4,5} 
Output: {1,2,3,4,5} 

Q44. Find Intersection of Two Arrays 
Write a program to find the intersection of two arrays. 
Example: 
Input: {1,2,3} and {2,3,4} 
Output: {2,3} 

Q45. Sort Array in Descending Order 
Write a program to sort an array of 10 elements in descending order. 
Example: 
Input: {3,1,4,2} 
Output: {4,3,2,1} 

Q46. Copy One Array into Another 
Write a program to copy elements of one array into another array. 
Array values should be taken from the user. 
Example: 
Input: {1,2,3} 
Output: {1,2,3} 

Q47. Find Smallest and Greatest Number (Any Size Array) 
Write a function to find the smallest and greatest number from an array of any size. 
Example: 
Input: {9, 4, 6, 2} 
Output: 
Smallest = 2   
Greatest = 9 

Q48. Sort an Array 
Write a function to sort an array. 
Example: 
Input: {5,3,1,4} 
Output: {1,3,4,5} 

Q49. Swap Pair Elements 
Write a function to swap elements of an array in pairs. 
Example: 
Input: {3,2,4,5} 
Output: {2,3,5,4} 

Q50. Merge Two Arrays in Descending Order 
Write a function to merge two arrays of the same size and sort the result in descending order. 
Example: 
Input: {5,3} and {4,1} 
Output: {5,4,3,1} 

Q51. Count Frequency of Each Element 
Write a function to count the frequency of each element in an array. 
Example: 
Input: {1,2,2,3,3,3} 
Output: 
1 → 1   
2 → 2   
3 → 3 

Q52. Matrix Multiplication (3×3) 
Write a program to calculate the product of two matrices of order 3 × 3. 

Q53. Transpose of a Matrix 
Write a program to print the transpose of a given matrix. 
Example: 
Input: 
1 2   
3 4 
Output: 
1 3   
2 4 

Q54. Sum of Two Matrices (3×3) 
Write a program to calculate the sum of two matrices of order 3 × 3. 

Q55. First Adjacent Duplicate Element 
Write a function to find the first occurrence of adjacent duplicate values in an array. 
The function should return the value of the element. 
Example: 
Input: {1, 2, 2, 3, 3} 
Output: 2 

Q56. Remove Duplicate Elements from an Array / String 
Write a program to remove duplicate elements from a given array or string using Set. 
Example: 
Input: {1, 2, 2, 3, 4, 4} 
Output: {1, 2, 3, 4} 

Q57. Check if Array Contains Duplicates 
Write a program to check whether a given array contains duplicate elements. 
Example: 
Input: {1, 2, 3, 4, 1} 
Output: true 

Q58. Find Intersection of Two Arrays 
Write a program to find the intersection of two arrays using Set. 
Example: 
Input: {1, 2, 3, 4} and {3, 4, 5} 
Output: {3, 4} 

Q59. Check if Two Arrays Have Common Elements 
Write a program to check whether two arrays have at least one common element. 
Example: 
Input: {1, 2, 3} and {4, 5, 3} 
Output: true 

Q60. Find First Repeating Element 
Write a function to find the first repeating element in an array. 
Example: 
Input: {10, 5, 3, 4, 3, 5, 6} 
Output: 3 

Q61. Check if String Has All Unique Characters 
Write a program to check whether all characters in a string are unique. 
Example: 
Input: "abcdef" 
Output: true 
Input: "programming" 
Output: false 

Q62. Find Missing Number Using Set 
An array contains numbers from 1 to n with one missing number. 
Write a program to find the missing number using Set. 
Example: 
Input: {1, 2, 4, 5} 
Output: 3 

Q63. Find Duplicate Words in a Sentence 
Write a program to find duplicate words in a given sentence. 
Example: 
Input: "java is java and java is powerful" 
Output: java 

Q64. Count Frequency of Characters in a String 
Write a program to count the frequency of each character in a given string using HashMap. 
Example: 
Input: "aabbc" 
Output: 
a → 2   
b → 2   
c → 1 

Q65. Count Frequency of Words in a Sentence 
Write a program to count the frequency of each word in a sentence. 
Example: 
Input: "java is java and java is powerful" 
Output: 
java → 3   
is → 2   
and → 1   
powerful → 1 

Q66. Find First Non-Repeating Character 
Write a function to find the first non-repeating character in a string. 
Example: 
Input: "swiss" 
Output: 'w' 

Q67. Find Maximum Occurring Character 
Write a program to find the character that occurs maximum number of times in a string. 
Example: 
Input: "interview" 
Output: 'i' 

Q68. Check Anagram Using Map 
Write a function to check whether two strings are anagrams using HashMap. 
Example: 
Input: "listen", "silent" 
Output: true 

Q69. Find Duplicate Elements in an Array 
Write a program to find duplicate elements in an array using HashMap. 
Example: 
Input: {1, 2, 3, 2, 4, 3} 
Output: {2, 3} 

Q70. Two Sum Problem 
Given an array and a target value, write a program to find indices of the two numbers such that they add up to the target. 
Example: 
Input: {2, 7, 11, 15}, Target = 9 
Output: (0, 1) 

Q71. Find All Elements Occurring K Times 
Write a function to find all elements that occur exactly k times in an array. 
Example: 
Input: {1,2,2,3,3,3}, k = 2 
Output: 2 

Q72. Group Anagrams 
Given a list of strings, group all anagrams together. 
Example: 
Input: {"eat","tea","tan","ate","nat","bat"} 
Output: 
[ 
["eat","tea","ate"], 
["tan","nat"], 
["bat"] 
] 

Q73. Sort Map by Value (Descending Order) 
Write a program to sort a HashMap by its values in descending order. 
Example: 
Input: {A=10, B=30, C=20, D=40} 
Output: 
D=40   
B=30   
C=20   
A=10 
`;

const blocks = rawText.split(/(?=Q\d+\.)/g).filter(b => b.trim());

const questions = blocks.map(block => {
  const lines = block.trim().split('\n');
  const titleLine = lines[0];
  const titleMatch = titleLine.match(/Q\d+\.\s*(.*)/);
  const title = titleMatch ? titleMatch[1].trim() : titleLine;

  const descLines = [];
  let inExample = false;
  let examplesText = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().startsWith('example')) {
      inExample = true;
    }
    
    if (inExample) {
      examplesText.push(line);
    } else {
      descLines.push(line);
    }
  }

  let descriptionMarkdown = descLines.join('  \n');
  if (examplesText.length > 0) {
    descriptionMarkdown += '\n\n### Example\n```text\n' + examplesText.slice(1).join('\n') + '\n```';
  }

  const funcName = title.split(' ').map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('').replace(/[^a-zA-Z0-9]/g, '');
  const folderName = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const className = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('').replace(/[^a-zA-Z0-9]/g, '');

  const starterCode = [
    {
      "filename": "src/App.tsx",
      "content": `import React, { useState } from 'react';\nimport axios from 'axios';\n\nexport default function App() {\n  const [inputData, setInputData] = useState('');\n  const [result, setResult] = useState<any>(null);\n\n  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    // TODO: Implement the Axios API call to send inputData to /api/${folderName}\n    // TODO: Set the response to the result state variable\n  };\n\n  return (\n    <div className=\"p-6\">\n      <h2 className=\"text-xl font-bold\">${title} Solver</h2>\n      <form onSubmit={handleSubmit}>\n        {/* TODO: Add input fields and bind them to the inputData state */}\n        \n        <button type=\"submit\" className=\"mt-4 bg-indigo-600 text-white p-2 rounded\">Run Algorithm</button>\n      </form>\n      \n      {/* TODO: Render the result data dynamically here */}\n    </div>\n  );\n};`,
      "language": "tsx",
      "editable": true
    },
    {
      "filename": `backend/src/${folderName}/${folderName}.service.ts`,
      "content": `import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class ${className}Service {\n  solve(input: any): any {\n    // TODO: Implement the algorithm for ${title}\n    return { result: null };\n  }\n}`,
      "language": "typescript",
      "editable": true
    },
    {
      "filename": `backend/src/${folderName}/${folderName}.dto.ts`,
      "content": `export class ${className}Dto {\n  input: any;\n}`,
      "language": "typescript",
      "editable": false
    },
    {
      "filename": `backend/src/${folderName}/${folderName}.controller.ts`,
      "content": `import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';\nimport { ${className}Service } from './${folderName}.service';\nimport { ${className}Dto } from './${folderName}.dto';\n\n@Controller('api/${folderName}')\nexport class ${className}Controller {\n  constructor(private readonly service: ${className}Service) {}\n\n  @Post()\n  @HttpCode(HttpStatus.OK)\n  run(@Body() dto: ${className}Dto) {\n    return this.service.solve(dto.input);\n  }\n}`,
      "language": "typescript",
      "editable": false
    },
    {
      "filename": `backend/src/${folderName}/${folderName}.module.ts`,
      "content": `import { Module } from '@nestjs/common';\nimport { ${className}Controller } from './${folderName}.controller';\nimport { ${className}Service } from './${folderName}.service';\n\n@Module({\n  controllers: [${className}Controller],\n  providers: [${className}Service],\n})\nexport class ${className}Module {}`,
      "language": "typescript",
      "editable": false
    },
    {
      "filename": "backend/src/app.module.ts",
      "content": `import { Module } from '@nestjs/common';\nimport { ${className}Module } from './${folderName}/${folderName}.module';\n\n@Module({\n  imports: [${className}Module],\n})\nexport class AppModule {}`,
      "language": "typescript",
      "editable": false
    }
  ];

  const fullDescription = `### Objective\nCreate a full-stack application to solve the classic algorithm: **${title}**.\n\n### Problem Description\n${descriptionMarkdown}\n\n### File Overview\n* **\`src/App.tsx\`**: The React component for user input.\n* **\`backend/src/${folderName}/${folderName}.service.ts\`**: The NestJS service containing the algorithm.\n* **\`backend/src/${folderName}/${folderName}.controller.ts\`**: The controller defining the route.`;

  return {
    title: `${title} Fullstack`,
    description: fullDescription,
    type: "fullstack",
    userPrompt: `Generate a Full Stack React + NestJS coding challenge for the DSA problem "${title}".`,
    status: "published",
    starterCode,
    editableFiles: [
      "src/App.tsx",
      `backend/src/${folderName}/${folderName}.service.ts`
    ],
    hiddenTestCount: 2,
    visibleTests: [
      {
        "description": "Verify that the backend endpoint processes the standard input correctly and returns a successful response.",
        "type": "visible"
      },
      {
        "description": "Check if the frontend React component renders successfully and the Axios submission triggers properly.",
        "type": "visible"
      }
    ]
  };
});

fs.writeFileSync('dsa_interview_questions.json', JSON.stringify(questions, null, 2));
console.log('Successfully generated dsa_interview_questions.json with ' + questions.length + ' questions.');
