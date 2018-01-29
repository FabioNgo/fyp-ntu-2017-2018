import {Rule} from './Rule';
import {RulesChangeListener} from '../Controllers/RulesChangeListener';

export class RulesManager {
  private static instance: RulesManager;
  private rules: Rule[];
  private rulesChangeListeners: RulesChangeListener[];

  constructor() {
    this.rules = [];
    this.rulesChangeListeners = [];
  }

  static getInstance(): RulesManager {
    if (this.instance === undefined) {
      this.instance = new RulesManager();
    }
    return this.instance;
  }

  addRulesChangeListener(listener: RulesChangeListener) {
    this.rulesChangeListeners.push(listener);
  }

  getRules(): Rule[] {
    return this.rules;
  }

  rulesChanged() {
    this.rulesChangeListeners.forEach(listener => {
      listener.update();
    });
  }

  removeRule(rule: Rule) {
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].keyword === rule.keyword) {
        this.rules.splice(i, 1);
        break;
      }
    }
    this.rulesChanged();
  }

  addRule(rule: Rule) {
    if (rule.keyword === undefined || rule.token === undefined || rule.keyword === '' || rule.token === '') {

    } else {
      for (let i = 0; i < this.rules.length; i++) {
        if (this.rules[i].keyword === rule.keyword || this.rules[i].token === rule.token) {
          return;
        } else {

        }
      }
      this.rules.push(rule);
    }
    this.rulesChanged();
  }

}
