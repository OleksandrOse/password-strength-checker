import { Component, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() public passwordToCheck: string = '';
  @Output() passwordStrength = new EventEmitter<boolean>();

  bar0: string = '';
  bar1: string = '';
  bar2: string = '';

  [key: string]: any;

  msg = '';

  private colors = ['gray', 'red', 'yellow', 'green'];

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;
    this.setBarColors(3, 'gray');
    if (password) {
      const strength = this.calculatePasswordStrength(password);
      const colorIdx = this.getColorIndex(strength);
      this.setBarColors(colorIdx, this.colors[colorIdx]);

      if(password.length < 8) {
        this.setBarColors(3, 'red');
        this.passwordStrength.emit(false);
        this.msg = 'Weak';
      } else if (colorIdx === 3) {
        this.passwordStrength.emit(true);
        this.msg = 'Strong';
      } else {
        this.passwordStrength.emit(false);
        this.msg = colorIdx === 1 ? 'Weak' : 'Medium';
      }
    } else {
      this.passwordStrength.emit(false);
      this.msg = '';
    }
  }

  private calculatePasswordStrength(password: string) {
    const hasLetters = /[A-Za-z]+/.test(password);
    const hasDigits = /[0-9]+/.test(password);
    const hasSymbols = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-=/\\|]/.test(password);

    if (hasLetters && hasDigits && hasSymbols) {
      return 3;
    } else if ((hasLetters && hasDigits) || (hasLetters && hasSymbols) || (hasDigits && hasSymbols)) {
      return 2;
    } else {
      return 1;
    }
  }

  private getColorIndex(strength: number) {
    if (strength === 1) {
      return 1;
    } else if (strength === 2) {
      return 2;
    } else {
      return 3;
    }
  }
 
  private setBarColors(count: number, col: string) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }
}