import m from 'mithril';
import render from 'mithril-node-render';
import Landing from './landing';

// import './styles/themes.scss';

//

export default (locals, callback) => {
  // render(document.body, m(Landing));
  render(m('span', 'huhu')).then(function (html) {
  // html === '<span>huhu</span>'
    callback(null, "<html><head><title>Nice</title></head><body><h1>" + html + "</h1></body></html>");
  })

}
