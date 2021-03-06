import he from 'he';
import SmartView from './smart.js';
import dayjs from 'dayjs';
import {COMMENT_EMOJIS, CommentsStatus, ENTER} from '../const.js';
import {getFilmDuration} from '../utils/films.js';

const createCommentTemplate = (comment, commentsStatus, deleteCommentId) => {

  const {id, emoji, text, author, day} = comment;

  const deletingStatusButtonTemplate = '<button="film-details__comment-delete">Deleting...</button>';
  const deleteButtonTemplate = `<button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>`;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(day).format('DD MMMM YYYY')}</span>
          ${commentsStatus === CommentsStatus.COMMENTS_DELETING && id === deleteCommentId ? `${deletingStatusButtonTemplate}`: `${deleteButtonTemplate}`}
        </p>
        </div>
    </li>`
  );
};

const createFilmPopupViewTemplate = (film, comments, data, commentsStatus, deleteCommentId, isTextAreaDisabled) => {

  const {poster, title, originalTitle, rating, director, writers, actors, releaseDate, country, genres, description, ageLimit, runtime, isWatchlist, isWatched, isFavorite} = film;

  const getFilmGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;
  const isFilmFlag = (flag) => (flag) ? 'film-details__control-button--active' : '';

  const createUserCommentTemplate = (userComment) => {

    const {emoji, text} = userComment;

    const imgEmodji = emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">` : '';

    const userText = text === null ? '' : text;

    return (
      `<div for="add-emoji" class="film-details__add-emoji-label">
          ${imgEmodji}
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"  
          ${isTextAreaDisabled === true ? 'disabled' : ''}>${userText}</textarea>
        </label>`
    );
  };

  const createEmojiTemplate = (emojiInput) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiInput}" value="${emojiInput}">
    <label class="film-details__emoji-label" for="emoji-${emojiInput}">
      <img src="./images/emoji/${emojiInput}.png" width="30" height="30" alt="emoji">
    </label>`
  );

  const createCommentsNoLoadTemplate = () => (
    `<li class="film-details__comment">
      <div>
        <p class="film-details__comment-text">!!!COMMENTS HASN'T LOADED!!!</p>
      </div>              
    </li>`
  );

  const filmCommentsTemplate = comments.map((comment) => createCommentTemplate(comment, commentsStatus, deleteCommentId)).join('');
  const writersTemplate = writers.join(', ');
  const actorsTemplate = actors.join(', ');
  const genreTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const genreTemplate = genres.map((genre) => getFilmGenreTemplate(genre)).join('');
  const isWatchlistClassName = isFilmFlag(isWatchlist);
  const isWatchedClassName = isFilmFlag(isWatched);
  const isFavoriteClassName = isFilmFlag(isFavorite);
  const filmCommentsCount = film.commentsId.length;
  const userCommentTemplate = createUserCommentTemplate(data);
  const emojiInputTemplate = COMMENT_EMOJIS.map((emojiInput) => createEmojiTemplate(emojiInput)).join('');
  const filmDuration = getFilmDuration(runtime);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${ageLimit}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writersTemplate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actorsTemplate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${dayjs(releaseDate).format('DD MMMM YYYY')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">
                    ${filmDuration.hours > 0 ? `${filmDuration.hours}h`: ''}
                    ${filmDuration.minutes > 0 ? `${filmDuration.minutes}m`: ''}
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreTitle}</td>
                  <td class="film-details__cell">
                    ${genreTemplate}</td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${isWatchlistClassName} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${isWatchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button ${isFavoriteClassName} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmCommentsCount}</span></h3>

            <ul class="film-details__comments-list">
            ${commentsStatus === CommentsStatus.COMMENTS_NO_LOAD ? `${createCommentsNoLoadTemplate()}`: `${filmCommentsTemplate}`}
            </ul>
            <div class="film-details__new-comment">
              ${userCommentTemplate}
              <div class="film-details__emoji-list">
                ${emojiInputTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmPopupView extends SmartView {

  #film = null;
  #comments = null;
  #commentsStatus = null;
  #deleteCommentId = null;
  #isTextAreaDisabled = false;

  constructor(film, comments, commentsStatus) {
    super();
    this.#film = film;
    this.#comments = comments;
    this.#commentsStatus = commentsStatus;
    this._data = {
      emoji: null,
      text: null,
    };

    this.#inputTextComment = this.#inputTextComment.bind(this);
    this.#choiceEmojiComment = this.#choiceEmojiComment.bind(this);
    this.#closePopupClickHandler = this.#closePopupClickHandler.bind(this);
    this.#watchlistClickHandler = this.#watchlistClickHandler.bind(this);
    this.#watchedClickHandler = this.#watchedClickHandler.bind(this);
    this.#favoritesClickHandler = this.#favoritesClickHandler.bind(this);
    this.#addCommentKeyDownHandler = this.#addCommentKeyDownHandler.bind(this);
    this.#deleteCommentClickHandler = this.#deleteCommentClickHandler.bind(this);

    this.setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupViewTemplate(this.#film, this.#comments, this._data, this.#commentsStatus, this.#deleteCommentId, this.#isTextAreaDisabled);
  }

  #inputTextComment = (evt) => {

    this._data.text = he.encode(evt.target.value);
  }

  #choiceEmojiComment = (evt) => {

    evt.preventDefault();
    this.updateData({
      emoji: evt.target.value,
    });
  }

  setInnerHandlers() {

    this.getElement().querySelector('.film-details__comment-label').addEventListener('input', this.#inputTextComment);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this.#choiceEmojiComment);
  }

  #closePopupClickHandler = () => {

    this._callback.click();
  }

  #watchlistClickHandler = (evt) => {

    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {

    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoritesClickHandler = (evt) => {

    evt.preventDefault();
    this._callback.favoritesClick();
  }

  #addCommentKeyDownHandler = (evt) => {

    if (evt.key === ENTER && evt.ctrlKey) {

      if (this._data.emoji === null || this._data.text === null) {
        return;
      }

      evt.preventDefault();
      this._callback.addCommentKeyDown(this._data.emoji, this._data.text);
      this.#isTextAreaDisabled = true;
      this.updateElement();
      document.removeEventListener('keydown', this.#addCommentKeyDownHandler);
    }
  }

  #deleteCommentClickHandler = (evt) => {

    evt.preventDefault();

    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    this._callback.deleteCommentClick(evt.target.dataset.commentId);
    this.#commentsStatus = CommentsStatus.COMMENTS_DELETING;
    this.#deleteCommentId = evt.target.dataset.commentId;
    this.updateElement();
  }

  reset() {

    this.updateData(
      {
        emoji: null,
        text: null,
      },
    );
  }

  snake() {

    this.snake();
  }

  restoreHandlers() {

    this.setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
  }

  setClosePopupClickHandler(callback) {

    this._callback.click = callback;
    this.getElement()
      .querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  setWatchlistClickHandler(callback) {

    this._callback.watchlistClick = callback;

    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {

    this._callback.watchedClick = callback;

    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoritesClickHandler(callback) {

    this._callback.favoritesClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoritesClickHandler);
  }

  setAddCommentKeyDownHandler(callback) {

    this._callback.addCommentKeyDown = callback;
    document.addEventListener('keydown', this.#addCommentKeyDownHandler);
  }

  setDeleteCommentClickHandler(callback) {

    this._callback.deleteCommentClick = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentClickHandler);
  }
}
