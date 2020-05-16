import { screen, fireEvent, prettyDOM } from '@testing-library/dom'

test('should start the game after clicking start button', (done) => {
  document.body.innerHTML = '<div id="game-wrapper"></div>'

  require('../index')

  expect(document.querySelector('.menu-screen')).toBeTruthy()
  expect(document.querySelector('.chunk')).toBeFalsy()

  fireEvent.click(screen.getByText('Start'))

  setTimeout(() => {
    expect(document.querySelector('.menu-screen')).toBeFalsy()
    expect(document.querySelector('.chunk')).toBeTruthy()
    done()
  }, 1000)
})
