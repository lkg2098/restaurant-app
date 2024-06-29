import RestaurantList, { RestaurantNode } from "../restaurantList";

describe("test restaurantList append", () => {
  it("append to empty list", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    expect(list.head).toBeTruthy();
    expect(list.tail).toBeTruthy();
    expect(list.length).toBe(1);
    expect(list.head?.value.id).toBe("resA");
    expect(list.tail?.value.id).toBe("resA");
  });
  it("append to single element list", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    expect(list.head).toBeTruthy();
    expect(list.tail).toBeTruthy();
    expect(list.length).toBe(2);
    expect(list.head?.value.id).toBe("resA");
    expect(list.head?.next?.value.id).toBe("resB");
    expect(list.tail?.value.id).toBe("resB");
    expect(list.tail?.next).toBeNull();
    expect(list.tail?.prev?.value.id).toBe("resA");
  });
  it("append to multi element list", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    expect(list.head).toBeTruthy();
    expect(list.tail).toBeTruthy();
    expect(list.length).toBe(3);
    expect(list.head?.value.id).toBe("resA");
    expect(list.head?.next?.value.id).toBe("resB");
    expect(list.tail?.value.id).toBe("resC");
    expect(list.tail?.next).toBeNull();
    expect(list.tail?.prev?.value.id).toBe("resB");
  });
});

describe("test Restaurant List delete", () => {
  it("test delete head", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });
    list.delete("resA");
    expect(list.head?.value.id).toBe("resB");
    expect(list.length).toBe(3);
  });
  it("delete tail", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });
    list.delete("resD");
    expect(list.tail?.value.id).toBe("resC");
    expect(list.tail?.next).toBeNull();
    expect(list.length).toBe(3);
  });
  it("delete tail with length 2", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resD", score: 4 });
    list.delete("resD");

    expect(list.head?.value.id).toBe("resA");
    expect(list.tail?.value.id).toBe("resA");
    expect(list.head?.next).toBeNull();
    expect(list.tail?.next).toBeNull();
    expect(list.length).toBe(1);
  });
  it("delete head with length 2", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resD", score: 4 });
    list.delete("resA");

    expect(list.head?.value.id).toBe("resD");
    expect(list.tail?.value.id).toBe("resD");
    expect(list.head?.next).toBeNull();
    expect(list.tail?.next).toBeNull();
    expect(list.length).toBe(1);
  });
  it("delete last item in list", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.delete("resA");
    expect(list.length).toBe(0);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
  });
  it("delete tail when tail has a next", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resR", score: 1 });
    list2.append({ id: "resS", score: 2 });
    list2.append({ id: "resT", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();
    list.delete("resD");
    expect(list.tail?.value.id).toBe("resC");
    expect(list.tail?.next).toBeTruthy();
    expect(list.tail?.next?.value.id).toBe("resR");
    expect(list.length).toBe(3);
  });
  it("delete tail with 2 when tail has a next", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resD", score: 4 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resR", score: 1 });
    list2.append({ id: "resS", score: 2 });
    list2.append({ id: "resT", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();
    list.delete("resD");
    expect(list.tail?.value.id).toBe("resA");
    expect(list.head?.value.id).toBe("resA");
    expect(list.head?.next).toBeTruthy();
    expect(list.tail?.next).toBeTruthy();
    expect(list.head?.next?.value.id).toBe("resR");
    expect(list.tail?.next?.value.id).toBe("resR");
    expect(list2.head?.prev).toBeNull();
    expect(list.length).toBe(1);
  });

  it("delete head with 2 when tail has a next", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resD", score: 4 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resR", score: 1 });
    list2.append({ id: "resS", score: 2 });
    list2.append({ id: "resT", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();
    list.delete("resA");
    expect(list.tail?.value.id).toBe("resD");
    expect(list.head?.value.id).toBe("resD");
    expect(list.head?.next).toBeTruthy();
    expect(list.tail?.next).toBeTruthy();
    expect(list.head?.next?.value.id).toBe("resR");
    expect(list.tail?.next?.value.id).toBe("resR");
    expect(list2.head?.prev).toBeNull();
    expect(list.length).toBe(1);
  });
  it("append to sinlge item list where tail has next", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resD", score: 4 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resR", score: 1 });
    list2.append({ id: "resS", score: 2 });
    list2.append({ id: "resT", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();
    list.delete("resD");
    list.append({ id: "resO", score: 7 });
    expect(list.head?.value.id).toBe("resA");
    expect(list.tail?.value.id).toBe("resO");
    expect(list.tail?.prev?.value.id).toBe("resA");
    expect(list.tail?.next).toBeTruthy();
    expect(list.head?.next?.value.id).toBe("resO");
    expect(list.tail?.next?.value.id).toBe("resR");
  });
});

describe("test Insert and Delete", () => {
  it("insert first, delete second, both in middle", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });
    list.append({ id: "resR", score: 7 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    list.insertAndDelete({ id: "resR", score: 2 });

    expect(list.length).toBe(7);
    expect(list.toString()).toBe(
      "[resA, 1 --> resB, 2 --> resR, 2 --> resC, 3 --> resD, 4 --> resS, 8 --> resT, 9] length: 7"
    );
  });
  it("delete first, insert second, both in middle", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });
    list.append({ id: "resR", score: 7 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    list.insertAndDelete({ id: "resC", score: 8 });

    expect(list.length).toBe(7);
    expect(list.toString()).toBe(
      "[resA, 1 --> resB, 2 --> resD, 4 --> resR, 7 --> resS, 8 --> resC, 8 --> resT, 9] length: 7"
    );
  });
  it("delete head, insert into list", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });
    list.append({ id: "resR", score: 7 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    list.insertAndDelete({ id: "resA", score: 8 });

    expect(list.length).toBe(7);
    expect(list.toString()).toBe(
      "[resB, 2 --> resC, 3 --> resD, 4 --> resR, 7 --> resS, 8 --> resA, 8 --> resT, 9] length: 7"
    );
  });
  it("insert into list, delete tail", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });
    list.append({ id: "resR", score: 7 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    list.insertAndDelete({ id: "resT", score: 2 });

    expect(list.tail?.next).toBeNull();
    expect(list.length).toBe(7);
    expect(list.toString()).toBe(
      "[resA, 1 --> resB, 2 --> resT, 2 --> resC, 3 --> resD, 4 --> resR, 7 --> resS, 8] length: 7"
    );
  });
  it("insert into list, delete tail, tail has next", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resC", score: 3 });
    list.append({ id: "resD", score: 4 });
    list.append({ id: "resR", score: 7 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resM", score: 1 });
    list2.append({ id: "resN", score: 2 });
    list2.append({ id: "resO", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();

    list.insertAndDelete({ id: "resT", score: 2 });

    expect(list.tail?.next?.value.id).toBe("resM");
    expect(list.length).toBe(7);
    expect(list.toString()).toBe(
      "[resA, 1 --> resB, 2 --> resT, 2 --> resC, 3 --> resD, 4 --> resR, 7 --> resS, 8 --> ] length: 7"
    );
  });
  it("swap tail list length 2", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 2 });
    list.append({ id: "resT", score: 9 });

    list.insertAndDelete({ id: "resT", score: 1 });

    expect(list.length).toBe(2);
    expect(list.toString()).toBe("[resT, 1 --> resA, 2] length: 2");
  });
  it("swap head list length 2", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 2 });
    list.append({ id: "resT", score: 9 });

    list.insertAndDelete({ id: "resA", score: 10 });

    expect(list.length).toBe(2);
    expect(list.toString()).toBe("[resT, 9 --> resA, 10] length: 2");
    expect(list.tail?.next).toBeNull();
  });
  it("swap head list length 2, tail has next", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 2 });
    list.append({ id: "resT", score: 9 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resM", score: 1 });
    list2.append({ id: "resN", score: 2 });
    list2.append({ id: "resO", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();

    list.insertAndDelete({ id: "resA", score: 10 });

    expect(list.length).toBe(2);
    expect(list.toString()).toBe("[resT, 9 --> resA, 10 --> ] length: 2");
    expect(list.tail?.next?.value.id).toBe("resM");
  });

  it("swap tail list length 2", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 2 });
    list.append({ id: "resT", score: 9 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resM", score: 1 });
    list2.append({ id: "resN", score: 2 });
    list2.append({ id: "resO", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();

    list.insertAndDelete({ id: "resT", score: 1 });

    expect(list.length).toBe(2);
    expect(list.toString()).toBe("[resT, 1 --> resA, 2 --> ] length: 2");
    expect(list.tail?.next?.value.id).toBe("resM");
  });
  it("insert and delete change single item", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 2 });

    list.insertAndDelete({ id: "resA", score: 3 });
    expect(list.length).toBe(1);
  });
  it("insert and delete change single item", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 2 });

    list.insertAndDelete({ id: "resA", score: 1 });
    expect(list.length).toBe(1);
  });
});

describe("test insert", () => {
  it("insert into middle", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    list.insert({ id: "resD", score: 5 });

    expect(list.length).toBe(5);
    expect(list.toString()).toBe(
      "[resA, 1 --> resB, 2 --> resD, 5 --> resS, 8 --> resT, 9] length: 5"
    );
  });
  it("insert into at end", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    list.insert({ id: "resD", score: 10 });

    expect(list.length).toBe(5);
    expect(list.toString()).toBe(
      "[resA, 1 --> resB, 2 --> resS, 8 --> resT, 9 --> resD, 10] length: 5"
    );
  });
  it("insert into at end, tail has next", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 1 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    const list2 = new RestaurantList(null);
    list2.append({ id: "resM", score: 1 });
    list2.append({ id: "resN", score: 2 });
    list2.append({ id: "resO", score: 3 });

    if (list.tail) list.tail.next = list2.head;
    expect(list.tail?.next).toBeTruthy();

    list.insert({ id: "resD", score: 10 });

    expect(list.length).toBe(5);
    expect(list.tail?.next).toBeTruthy();
    expect(list.tail?.next?.value.id).toBe("resM");
    expect(list.toString()).toBe(
      "[resA, 1 --> resB, 2 --> resS, 8 --> resT, 9 --> resD, 10 --> ] length: 5"
    );
  });
  it("insert into at beginning", () => {
    const list = new RestaurantList(null);
    list.append({ id: "resA", score: 2 });
    list.append({ id: "resB", score: 2 });
    list.append({ id: "resS", score: 8 });
    list.append({ id: "resT", score: 9 });

    list.insert({ id: "resD", score: 1 });

    expect(list.length).toBe(5);
    expect(list.toString()).toBe(
      "[resD, 1 --> resA, 2 --> resB, 2 --> resS, 8 --> resT, 9] length: 5"
    );
  });
});
