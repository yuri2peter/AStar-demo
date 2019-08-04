import { observable } from 'mobx';

function getInitData() {
  return {
    openList: new Set(),
    closeList: new Set(),
    grid: [],
    nodes: {},
    A: '',
    B: '',
    barriers: new Set(),
    path: new Set(),
  };
}

class Model {
  static getIdByPosition(x, y) {
    return `(${x},${y})`;
  }

  @observable data = getInitData();

  constructor(x = 16, y = 9) {
    this.reset(x, y);
  }

  reset(x, y) {
    this.data = getInitData();
    for (let yy = 0; yy < y; yy += 1) {
      this.data.grid.push(Array.from({ length: x }).map((t, i) => {
        const id = Model.getIdByPosition(i, yy);
        const node = {
          id,
          x: i,
          y: yy,
          f: 0,
          g: 0,
          h: 0,
          parentId: '',
        };
        this.data.nodes[id] = node;
        return id;
      }));
    }
  };

  setA(id) {
    this.data.A = id;
  }

  setB(id) {
    this.data.B = id;
  }

  setBarrier(id) {
    if (this.data.barriers.has(id)) {
      this.data.barriers.delete(id);
    } else {
      this.data.barriers.add(id);
    }
  }

  start() {
    // 把起点加入 open list
    this.data.openList.add(this.data.A);
    this.next();
  }

  next() {
    // 把终点加入到了 open list 中，此时路径已经找到 或者 open list 是空的，此时没有路径。
    if (this.data.openList.has(this.data.B) || this.data.openList.size === 0) {
      return;
    }

    // 遍历 open list ，查找 F 值最小的节点，把它作为当前要处理的节点
    const opensSorted = Array.from(this.data.openList).map(t => this.getNodeById(t)).sort((a, b) => a.f - b.f);
    const current = opensSorted[0];
    const currentId = current.id;

    // 标亮当前路径
    const path = new Set();
    let currentPathNode = current;
    while (currentPathNode.parentId) {
      path.add(currentPathNode.id);
      currentPathNode = this.getNodeById(currentPathNode.parentId);
    }
    this.data.path = path;

    // 把这个节点移到 close list
    this.data.openList.delete(currentId);
    this.data.closeList.add(currentId);

    // 对当前方格的 8 个相邻方格的每一个方格...
    const nodesAround = this.getNodesAround(currentId);
    nodesAround.forEach(t => {
      if (this.data.barriers.has(t.id) || this.data.closeList.has(t.id) ) { return; }
      const costs = this.getCosts(currentId, t.id);
      if (this.data.openList.has(t.id)) {
        // 如果它已经在 open list 中，检查这条路径 ( 即经由当前方格到达它那里 ) 是否更好，用 G 值作参考。
        // 更小的 G 值表示这是更好的路径。如果是这样，把它的父亲设置为当前方格，并重新计算它的 G 和 F 值。
        // 如果你的 open list 是按 F 值排序的话，改变后你可能需要重新排序。
        if (costs.g < t.g) {
          t.parentId = currentId;
          Object.assign(t, costs);
        }
      } else {
        // 如果它不在 open list 中，把它加入 open list ，并且把当前方格设置为它的父亲，记录该方格的 F ， G 和 H 值
        this.data.openList.add(t.id);
        t.parentId = currentId;
        Object.assign(t, costs);
      }
    });
    setTimeout(() => {
      this.next();
    }, 200);
  }

  getCosts(fromId, toId) {
    const from = this.getNodeById(fromId);
    const to = this.getNodeById(toId);
    const b = this.getNodeById(this.data.B);
    const dis = Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    const g = (dis > 1 ? 14 : 10) + from.g;
    const h = (Math.abs(b.x - to.x) + Math.abs(b.y - to.y)) * 10;
    return {
      g,
      h,
      f: g + h,
    };
  }

  getNodeById(id) {
    return this.data.nodes[id];
  }

  getNodesAround(id) {
    const current = this.getNodeById(id);
    const { x, y } = current;
    const list = [
      Model.getIdByPosition(x - 1, y - 1 ),
      Model.getIdByPosition(x, y - 1),
      Model.getIdByPosition(x + 1, y - 1),
      Model.getIdByPosition(x - 1, y ),
      Model.getIdByPosition(x + 1, y),
      Model.getIdByPosition(x - 1, y + 1 ),
      Model.getIdByPosition(x, y + 1),
      Model.getIdByPosition(x + 1, y + 1),
    ];
    return list.map(t => this.getNodeById(t)).filter(t => !!t);
  }
}

export default Model;
