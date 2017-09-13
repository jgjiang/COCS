import { Component, OnInit } from '@angular/core';

declare var ace: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;
  public languages: string[] = ['Java', 'C++', 'Python'];
  language: string = 'Java'; // default

  languageModeMappings = {
    'Java': 'java',
    'C++': 'c_cpp',
    'Python': 'python'
  };

  defaultContent = {
    'Java': `public class Example {
      public static void main(String[] args) {
      // Type Your Code..
      
      }
    }`,
    'C++': `#include <iostream>
    using namespace std;
    int main() {
       // Type your C++ code here
       return 0;
    }`,

    'Python': `class Solution:
        def example():
            # Write your Python code here`
    };
  constructor() { }

  ngOnInit() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/cobalt');
    this.resetEditor();
    this.editor.getSession().setMode('ace/mode/java');
    this.editor.setValue(this.defaultContent['Java']);
    this.editor.$blockScrolling = Infinity;
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/' + this.languageModeMappings[this.language]);
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit(): void {
    let userCode = this.editor.getValue();
    console.log(userCode);
  }

}
