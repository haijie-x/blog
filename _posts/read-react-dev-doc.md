---
title: "Read react dev document"
excerpt: "阅读 React 官方文档"
coverImage: "/assets/blog/read-react-dev-doc/cover.jpg"
date: "2023-05-02T08:47:17.296Z"
---

## Describing the UI

### Conditional Rendering

#### Conditional (ternary) operator (? :)

这种风格适用于简单的条件，但要适度使用。如果您的组件因过多的嵌套条件标记而变得混乱，请考虑提取子组件以进行清理。在 React 中，标记是代码的一部分，因此您可以使用变量和函数等工具来整理复杂的表达式。

#### Logical AND operator (&&)

不要把数字放在 && 的左边。JavaScript 自动将左侧转换为布尔值。然而，如果左边是 0，那么整个表达式都会得到那个值 (0)，React 会愉快地呈现 0 而不是什么都没有。

#### Conditionally assigning JSX to a variable

```js
let itemContent = name;
if (isPacked) {
  itemContent = name + " ✔";
}
return <li className="item">{itemContent}</li>;
```

这不仅适用于文本，也适用于任意 JSX：

```js
let itemContent = name;
if (isPacked) {
  itemContent = <del>{name + " ✔"}</del>;
}
return <li className="item">{itemContent}</li>;
```

### Rendering Lists

- 箭头函数在 => 之后隐式返回表达式，所以你不需要 return 语句。
- 您可能会想使用数组中项目的索引作为其键。事实上，如果你根本不指定键，React 就会使用它。但是如果一个项目被插入、删除或者数组被重新排序，你渲染项目的顺序会随着时间的推移而改变。索引作为键通常会导致微妙且令人困惑的错误。
- 请注意，您的组件不会接收`key`作为`props`。它仅用作 React 本身的提示。如果你的组件需要一个 ID，你必须将它作为一个单独的 prop 传递
  `<Profile key={id} userId={id} />`。

### Keeping Components Pure

一些 JavaScript 函数是纯函数。纯函数仅执行计算，仅此而已。通过严格地将组件编写为纯函数，您可以在代码库增长时避免一整类令人困惑的错误和不可预测的行为。但是，要获得这些好处，您必须遵守一些规则。

#### Side Effects: (un)intended consequences

React 的渲染过程必须始终是纯净的。组件应该只返回它们的 JSX，而不是改变渲染前存在的任何对象或变量——那会使它们变得不纯！

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}
```

## Escape Hatches

### You Might Not Need an Effect

Effects 是 React 范式的逃生通道。它们让你“走出”React 并将你的组件与一些外部系统同步，比如非 React 小部件、网络或浏览器 DOM。如果不涉及外部系统（例如，如果您想在某些`props`或状态更改时更新组件的状态），则不需要 Effect。删除不必要的 Effects 将使您的代码更易于理解、运行速度更快并且更不容易出错。

- 您不需要 Effects 来转换数据以进行渲染。例如，假设您想在显示列表之前对其进行过滤。您可能很想编写一个 Effect 在列表更改时更新状态变量。然而，这是低效的。当你更新状态时，React 将首先调用你的组件函数来计算屏幕上应该显示什么。然后 React 会将这些更改“提交”到 DOM，更新屏幕。然后 React 将运行您的 Effects。如果您的 Effect 也立即更新状态，则整个过程将从头开始！为避免不必要的渲染过程，请转换组件顶层的所有数据。只要您的道具或状态发生变化，该代码就会自动重新运行。

- 您不需要 Effects 来处理用户事件。例如，假设您要发送 /api/buy POST 请求并在用户购买产品时显示通知。在 Buy 按钮单击事件处理程序中，您确切地知道发生了什么。在 Effect 运行时，您不知道用户做了什么（例如，单击了哪个按钮）。这就是为什么您通常会在相应的事件处理程序中处理用户事件。

让我们看一些常见的具体示例！

#### Updating state based on props or state

```js
function Form() {
  const [firstName, setFirstName] = useState("Taylor");
  const [lastName, setLastName] = useState("Swift");

  // ✅ Good: calculated during rendering
  const fullName = firstName + " " + lastName;

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    setFullName(firstName + " " + lastName);
  }, [firstName, lastName]);
  // ...
}
```

#### Caching expensive calculations

```js
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

通常，这段代码没问题！但也许 getFilteredTodos() 很慢或者你有很多待办事项。在这种情况下，如果一些不相关的状态变量（如 newTodo）发生了变化，你不想重新计算 getFilteredTodos() 。

```js
// ✅ Does not re-run getFilteredTodos() unless todos or filter change
const visibleTodos = useMemo(
  () => getFilteredTodos(todos, filter),
  [todos, filter]
);
```

#### Resetting all state when a prop changes

这个 ProfilePage 组件接收一个 `userId` 。该页面包含评论输入，您使用评论状态变量来保存它的值。有一天，您注意到一个问题：当您从一个配置文件导航到另一个配置文件时，评论状态不会重置。因此，很容易不小心在错误的用户个人资料上发表评论。要解决此问题，您需要在 `userId` 更改时清除评论状态变量：

```js
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState("");

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment("");
  }, [userId]);
  // ...
}
```

这是低效的，因为 ProfilePage 及其子组件将首先使用过时值呈现，然后再次呈现。它也很复杂，因为您需要在 ProfilePage 中具有某种状态的每个组件中执行此操作。在某些情况下，如果评论 UI 是嵌套的，你也会需要清除嵌套的评论状态，这很麻烦。

```js
export default function ProfilePage({ userId }) {
  return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState("");
  // ...
}
```

通常，当同一个组件在同一个地方渲染时，React 会保留状态。通过将 userId 作为键传递给 Profile 组件，您要求 React 将具有不同 userId 的两个 Profile 组件视为不应共享任何状态的两个不同组件。每当键（您已设置为 userId）更改时，React 将重新创建 DOM 并重置 Profile 组件及其所有子组件的状态。现在，在配置文件之间导航时，评论字段将自动清除。
