import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import withErrorBoundary from '../../component/lib/WithErrorBoundary';
import Model from './model';
import styles from './index.module.scss';

const SCALE_X = 16;
const SCALE_Y = 9;

@withErrorBoundary()
@observer
class Demo extends Component {
  model = new Model(SCALE_X, SCALE_Y);

  @observable action = 'a';

  onActionChange = (e) => {
    this.action = e.target.value;
  };

  onBlockClick = (id) => {
    if (this.action === 'a') {
      this.model.setA(id);
      this.action = 'b';
    } else if (this.action === 'b') {
      this.model.setB(id);
      this.action = 'c';
    } else if (this.action === 'c') {
      this.model.setBarrier(id);
    }
  };

  render() {
    const { nodes, grid, A, B, barriers, openList, closeList, path } = this.model.data;
    return (
      <div className={styles.game}>
        <p className={styles.action}>
          操作：
          <select onChange={this.onActionChange} value={this.action}>
            <option value="a">设置A点</option>
            <option value="b">设置B点</option>
            <option value="c">设置墙壁</option>
          </select>
          <button onClick={() => { this.model.start(); }}>寻路</button>
          <button onClick={() => { this.action = 'a'; this.model.reset(SCALE_X, SCALE_Y); }}>重置</button>
        </p>
        {
          grid.map(row => (
            <div className={styles.row}>
              {
                row.map((t) => (
                  <div
                    title={JSON.stringify(nodes[t], null, 2)}
                    key={t}
                    onClick={() => { this.onBlockClick(t); }}
                    className={classNames(styles.block, {
                      [styles.A]: A === t,
                      [styles.B]: B === t,
                      [styles.barrier]: barriers.has(t),
                      [styles.open]: openList.has(t),
                      [styles.close]: closeList.has(t),
                      [styles.path]: path.has(t),
                    })}>
                    {t}
                  </div>))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default Demo;
