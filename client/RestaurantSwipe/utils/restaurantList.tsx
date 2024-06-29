import Restaurant from "./restaurant";

type NodeValue = { id: string; score: number };

export class RestaurantNode {
  prev: RestaurantNode | null;
  next: RestaurantNode | null;
  value: NodeValue;
  constructor(
    value: NodeValue,
    prev: RestaurantNode | null,
    next: RestaurantNode | null
  ) {
    this.value = value;
    this.prev = prev || null;
    this.next = next || null;
  }

  toString() {
    return `prev: [${this.prev?.value.id}, ${this.prev?.value.score}], 
        value: [${this.value.id}, ${this.value.score}], 
        next: [${this.next?.value.id}, ${this.next?.value.score}]`;
  }
}

export default class RestaurantList {
  length: number;
  head: RestaurantNode | null;
  tail: RestaurantNode | null;

  constructor(headValue: NodeValue | null) {
    if (headValue) {
      let node = new RestaurantNode(headValue, null, null);
      this.length = 1;
      this.head = node;
      this.tail = node;
    } else {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
  }

  //insert into list in sorted order by score
  insert(value: NodeValue) {
    let curr = this.head;
    let i = 0;

    while (curr && i < this.length) {
      if (curr.value.score > value.score) {
        let node = new RestaurantNode(value, null, curr);
        if (curr.prev) {
          curr.prev.next = node;
        } else {
          this.head = node;
        }
        node.prev = curr.prev;
        curr.prev = node;
        this.length++;
        return;
      } else if (i == this.length - 1) {
        let node = new RestaurantNode(value, curr, this.tail?.next || null);
        curr.next = node;
        this.tail = node;
        this.length++;
        return;
      }
      curr = curr.next;
      i++;
    }
  }

  //append to end IF it's sorted
  append(value: NodeValue) {
    if (!this.tail) {
      let node = new RestaurantNode(value, null, null);
      this.head = node;
      this.tail = node;
      this.length = 1;

      return this;
    } else {
      if (this.tail.value.score <= value.score) {
        let node = new RestaurantNode(value, this.tail, this.tail.next);
        if (this.length == 1 && this.head) {
          this.head.next = node;
        } else {
          this.tail.next = node;
        }
        this.tail = node;

        this.length++;
        return this;
      } else {
        return 0;
      }
    }
  }

  insertAndDelete(value: NodeValue) {
    let curr = this.head;
    let deleted = false;
    let inserted = false;
    let i = 0;

    if (!curr) {
      this.append(value);
    }
    while (curr && ((!deleted && i < this.length) || i < this.length + 1)) {
      if (curr.value.id == value.id) {
        if ((curr.value.score > value.score && !inserted) || this.length == 1) {
          curr.value = value;
          return this;
        } else {
          if (curr.prev) {
            curr.prev.next = curr.next;
          } else {
            this.head = curr.next;
          }
          if (curr.next) curr.next.prev = curr.prev;
          if (curr.value.id == this.tail?.value.id) {
            this.tail = curr.prev;
          }
          deleted = true;
          this.length--;
          if (inserted) {
            return this;
          }
        }
      } else if (curr.value.score > value.score && !inserted) {
        let node = new RestaurantNode(value, null, curr);
        if (curr.prev) {
          curr.prev.next = node;
        } else {
          this.head = node;
        }
        curr.prev = node;
        inserted = true;
        this.length++;
        if (deleted) return this;
      } else if (
        i == this.length - 1 ||
        (deleted && !inserted && i == this.length)
      ) {
        let node = new RestaurantNode(value, curr, curr.next);
        curr.next = node;
        this.tail = node;
        this.length++;
        return this;
      }
      curr = curr.next;
      i++;
    }
  }

  // pop off the head of the list
  pop() {
    if (this.head) {
      if (this.head.next) {
        this.head.next.prev = null;
        this.head = this.head.next;
      } else {
        this.head = null;
        this.tail = null;
      }
      this.length--;
    }
    return this;
  }

  // delete node
  delete(id: string) {
    if (!(this.head && this.tail)) {
      return null;
    }
    let i = 0;
    let start = this.head;
    let end = this.tail;
    while (i < this.length / 2) {
      if (start.value.id == id) {
        if (start.next) start.next.prev = start.prev;
        if (start.prev) {
          start.prev.next = start.next;
        } else {
          this.head = start.next;
        }
        this.length--;
        if (this.length == 0) {
          this.head = null;
          this.tail = null;
        }
        return;
      } else if (end.value.id == id) {
        if (end.prev) end.prev.next = end.next;
        if (end.next && i != 0) {
          end.next.prev = end.prev;
        } else {
          this.tail = end.prev;
        }
        this.length--;
        if (this.length == 0) {
          this.head = null;
          this.tail = null;
        }
        return;
      }
      if (start.next) start = start.next;
      if (end.prev) end = end.prev;
      i++;
    }
    return;
  }

  // find node by id
  find(id: string) {
    if (!(this.head && this.tail)) {
      return null;
    }
    let i = 0;
    let start = this.head;
    let end = this.tail;
    while (i < this.length / 2) {
      if (start.value.id == id) {
        return start;
      } else if (end.value.id == id) {
        return end;
      }
      if (start.next) start = start.next;
      if (end.prev) end = end.prev;
      i++;
    }
    return null;
  }

  // print list as string
  toString() {
    let output = "[";
    let curr: RestaurantNode | null;
    curr = this.head;
    let i = 0;

    while (curr && i < this.length) {
      output += curr.value.id;
      if (curr.value.score) output += `, ${curr.value.score}`;
      if (curr.next) output += " --> ";
      curr = curr.next;
      i++;
    }
    output += "] length: " + this.length;
    return output;
  }
}

export function buildListFromArray(arr: Array<NodeValue>) {
  let sortedArray = arr.sort((a: NodeValue, b: NodeValue) => {
    if (!b.score) return -1;
    return a.score - b.score;
  });

  let list = new RestaurantList(sortedArray[0]);
  for (let i = 1; i < arr.length; i++) {
    list.append({ id: arr[i].id, score: arr[i].score });
    // let node = new RestaurantNode(arr[i], list.tail.next, null);
    // list.tail.next = node;
    // list.tail = node;
  }

  return list;
}
