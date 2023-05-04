const App = (header, main, settings, footer) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('app-wrapper');
  wrapper.append(header.element, main.element, settings.element, footer.element);
  document.body.replaceChildren(wrapper);
};

export default App;
