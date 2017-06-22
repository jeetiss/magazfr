import React from 'react'
import GoogleMapReact from 'google-map-react'
import { connect } from 'react-redux'
import styled, { injectGlobal } from 'styled-components'
import ReactDOM from 'react-dom'

const { fetch } = window

injectGlobal`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: white;
    font-family: 'Roboto', sans-serif;
  }
`

const HeaderContainer = styled.div`
  display:flex;
  flex-direction: row;
  background-color: #7c93e6;
  justify-content: center;
`

const HeaderButton = styled.div`
  line-height: 34px;
  padding: 5px 10px;
  cursor: pointer;
  ${props => (props.active ? 'background-color: #2b3467; color: #fff;' : '')}

  &:hover {
    background-color: #6668c1;
    color: #f9f8f8;
  }

`

const Button = (name, path, text, activePage, loadedPages, dispatch) => (
  <HeaderButton
    active={activePage === name}
    onClick={() => {
      dispatch({ type: 'switch_page', page: name })
      if (!loadedPages[name]) {
        dispatch(dispatch => {
          dispatch({ type: 'start_load', page: name })
          fetch(path)
            .then(res => res.json())
            .then(data => dispatch({ type: 'finish_load', page: name, data }))
        })
      }
    }}
  >
    {text}
  </HeaderButton>
)

const Header = connect(state => ({
  activePage: state.activePage,
  loadedPages: state.pages,
  bucket: state.bucket
}))(({ activePage, dispatch, loadedPages, bucket }) => (
  <HeaderContainer>
    <HeaderButton
      active={activePage === 'main'}
      onClick={() => dispatch({ type: 'switch_page', page: 'main' })}
    >
      Главная
    </HeaderButton>
    {Button(
      'items',
      process.env.SERVER + '/api/items',
      'Товары',
      activePage,
      loadedPages,
      dispatch
    )}
    {Button(
      'services',
      process.env.SERVER + '/api/services',
      'Услуги',
      activePage,
      loadedPages,
      dispatch
    )}
    {Button(
      'contacts',
      process.env.SERVER + '/api/contacts',
      'Контакты',
      activePage,
      loadedPages,
      dispatch
    )}
    <Bucket dispatch={dispatch} bucket={bucket} />
  </HeaderContainer>
))

const Bucket = ({ bucket, dispatch }) => (
  <BucketContainer>
    <ClickOutside handler={() => dispatch({ type: 'hide_bucket' })}>
      <HeaderButton onClick={() => dispatch({ type: 'show_bucket' })}>
        Корзина
      </HeaderButton>
      <BucketBody visible={bucket.active}>
        {!!bucket.items.length &&
          <div>
            Тoвары в корзине:
            {bucket.items.map((item, i) => <div key={i}>{item.name}</div>)}
          </div>}
        {!!bucket.services.length &&
          <div>
            Заказанные услуги:
            {bucket.services.map((service, i) => (
              <div key={i}>{service.title}</div>
            ))}
          </div>}
        {!bucket.items.length && !bucket.services.length
          ? <div>Пусто</div>
          : <ItemPrice onClick={() => dispatch({ type: 'buy' })}>
              Купить
            </ItemPrice>}
      </BucketBody>
    </ClickOutside>
  </BucketContainer>
)

class ClickOutside extends React.Component {
  constructor (...args) {
    super(...args)
    this.handler = e => {
      if (!ReactDOM.findDOMNode(this).contains(e.target)) {
        this.props.handler(e)
      }
    }
  }
  componentDidMount () {
    document.addEventListener('click', this.handler, false)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handler)
  }

  render () {
    const { children } = this.props

    return (
      <div
        ref={cc => {
          this.cc = cc
        }}
      >
        {children}
      </div>
    )
  }
}

const BucketContainer = styled.div`
  position: relative;
`
const BucketBody = styled.div`
  position: absolute;
  z-index: 10;
  width: 331px;
  background-color: #fff;
  padding: 10px;
  box-shadow: 1px 4px 5px 0px rgba(0, 0, 0, 0.2);
  ${props => !props.visible && 'display: none'}
`

const Img = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  color: #fff;
  font-size: 20px;
  padding: 20px;
  background-image: url('http://moysignal.ru/wp-content/uploads/2014/08/original.jpg');
  background-size: cover;
  background-position: 0px -145px;
`

const Cart = styled.div`
background-color: #f1f1f1;
padding: 20px;
`

const MainPage = connect(state => ({
  activePage: state.activePage
}))(
  ({ activePage, dispatch }) =>
    activePage === 'main' &&
    <div>
      <Img alt='камера'>Element.security</Img>
      <Cart>
        <div>О НАС</div>
        <div>
          Мы организация, предоставляющая профессиональные охранные услуги. Наши ресурсы позволяют нам принимать под охрану объекты различных категорий, сложности и масштаба. Мы оказываем услуги по охране объектов и защите имущества юридическим и физическим лицам.Руководящий состав и персонал нашей организации имеют серьёзный многолетний опыт обеспечения охраны и безопасности, как стационарных объектов, так и мероприятий федерального и мирового уровня. Накопленные за долгие годы работы знания, системы и методики, мы готовы применять и для обеспечения охраны, а при необходимости и комплексной безопасности Ваших объектов, предприятий и Компаний.Свою деятельность наше предприятие осуществляет исключительно в рамках законодательства «О частной, детективной и охранной деятельности РФ»
        </div>
      </Cart>
    </div>
)

const Page = connect(state => ({
  activePage: state.activePage,
  loadedPages: state.pages,
  data: state.pages[state.activePage] && state.pages[state.activePage].data
}))(
  ({ name, path, children, activePage, loadedPages, data, dispatch }) =>
    activePage === name &&
    <div>
      {!loadedPages[name].loading
        ? React.Children.map(children, child =>
            React.cloneElement(
              child,
              { data: JSON.stringify(data), dispatch },
              []
            )
          )
        : <div>Loading...</div>}
    </div>
)

// this.props.children, (child => React.cloneElement(child

const AppContainer = styled.div`
  width: 900px;
  margin: auto;
`

const ItemBlock = styled.div`
  width: 100%;
  dispay: flex;
  flex-direction: column;
  padding: 10px;
  margin: 5px;
  border-radius: 2px;
  background-color: #f1f1f1;
`

const ItemHeader = styled.div``
const ItemBody = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`

const ItemPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b3467;
  color: #fff;
  line-height: 39px;
  border-radius: 5px;
  flex: 0 0 225px;
  margin: 5px;
  cursor: pointer;

  &:hover {
    background-color: #6668c1;
    color: #f9f8f8;
  }
`

const ItemText = styled.div`
font-size: 14px;
`

const Item = ({ name, text, price, dispatch }) => (
  <ItemBlock>
    <div>{name}</div>
    <ItemBody>
      <ItemText>{text}</ItemText>
      <ItemPrice
        onClick={() =>
          dispatch({ type: 'add_item', item: { text, name, price } })}
      >
        купить за {price}
      </ItemPrice>
    </ItemBody>
  </ItemBlock>
)

const MainContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`

const Items = ({ data, dispatch }) => {
  const items = JSON.parse(data)

  return (
    <MainContainer>
      {items.map((item, i) => <Item {...item} dispatch={dispatch} key={i} />)}
    </MainContainer>
  )
}

const Service = ({ title, text, dispatch }) => (
  <ItemBlock>
    <div>{title}</div>
    <ItemBody>
      <ItemText>{text}</ItemText>
      <ItemPrice
        onClick={() =>
          dispatch({ type: 'add_service', service: { text, title } })}
      >
        Оформить
      </ItemPrice>
    </ItemBody>
  </ItemBlock>
)

const Services = ({ data, dispatch }) => {
  const services = JSON.parse(data)

  return (
    <MainContainer>
      {services.map((service, i) => (
        <Service key={i} dispatch={dispatch} {...service} />
      ))}
    </MainContainer>
  )
}

const ContactsBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 5px;
`

// const ContactsItem = styled.div``

const Label = styled.div`
background-color: #fff;
padding: 10px;
border-radius: 5px;
width: 100px
`

const Text = ({ text }) => <Label>{text}</Label>
const Contacts = ({ data }) => {
  const { skype, mail, address, tel } = JSON.parse(data)

  return (
    <ContactsBody style={{ width: '100%', height: '600px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.GMKEY,
          language: 'ru'
        }}
        defaultCenter={{ lat: 46.313, lng: 39.96 }}
        defaultZoom={12}
      >
        <Text lat={46.3132374} lng={39.960912} text={'Element.security'} />
      </GoogleMapReact>
      <div>{skype}</div>
      <div>{mail}</div>
      <div>{address}</div>
      <div>{tel}</div>
    </ContactsBody>
  )
}

function App () {
  return (
    <AppContainer>
      <Header />
      <div>
        <MainPage />
        <Page name='items'>
          <Items />
        </Page>
        <Page name='services'>
          <Services />
        </Page>
        <Page name='contacts'>
          <Contacts />
        </Page>
      </div>
    </AppContainer>
  )
}

export default App
