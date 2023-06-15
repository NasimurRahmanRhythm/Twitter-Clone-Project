export function getNestedLayout({Parent,Child}) {
  return ({ children }) => (
    <Parent>
      <Child>{children}</Child>
    </Parent>
  );
}
