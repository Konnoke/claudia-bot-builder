/*global describe, xdescribe, it, expect, beforeEach, require */
'use strict';

const formatFbMessage = require('../../lib/facebook/format-message');

describe('Facebook format message', () => {
  it('should export an object', () => {
    expect(typeof formatFbMessage).toBe('object');
  });

  describe('Generic template', () => {
    let generic;

    beforeEach(() => {
      generic = new formatFbMessage.generic();
    });

    it('should be a class', () => {
      expect(typeof formatFbMessage.generic).toBe('function');
      expect(generic instanceof formatFbMessage.generic).toBeTruthy();
    });

    it('should throw an error if at least one bubble/element is not added', () => {
      expect(() => generic.get()).toThrowError('Add at least one bubble first!');
    });

    it('should throw an error if bubble title does not exist', () => {
      expect(() => generic.addBubble()).toThrowError('Bubble title cannot be empty');
    });

    it('should throw an error if bubble title is too long', () => {
      expect(() => generic.addBubble('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble title cannot be longer than 80 characters');
    });

    it('should throw an error if bubble subtitle is too long', () => {
      expect(() => generic.addBubble('Test', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble subtitle cannot be longer than 80 characters');
    });

    it('should add a bubble with a provided title', () => {
      generic.addBubble('Test');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].title).toBe('Test');
    });

    it('should add a bubble with a provided title and subtitle', () => {
      generic.addBubble('Test Title', 'Test Subtitle');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].title).toBe('Test Title');
      expect(generic.bubbles[0].subtitle).toBe('Test Subtitle');
    });

    it('should throw an error if you try to add an url but not provide it', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addUrl()).toThrowError('URL is required for addUrl method');
    });

    it('should throw an error if you try to add an url in invalid format', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addUrl('http//invalid-url')).toThrowError('URL needs to be valid for addUrl method');
    });

    it('should add an url if it is valid', () => {
      generic
        .addBubble('Test')
        .addUrl('http://google.com');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].item_url).toBe('http://google.com');
    });

    it('should throw an error if you try to add an image but not provide an url', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addImage()).toThrowError('Image URL is required for addImage method');
    });

    it('should throw an error if you try to add an image, but url is in invalid format', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addImage('http//invalid-url')).toThrowError('Image URL needs to be valid for addImage method');
    });

    it('should add an url if it is valid', () => {
      generic
        .addBubble('Test')
        .addUrl('http://google.com/path/to/image.png');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].item_url).toBe('http://google.com/path/to/image.png');
    });

    it('should throw an error if you add a button without the title', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton('Title')).toThrowError('Bubble value is required');
    });

    it('should add a button with title and payload if you pass valid format', () => {
      generic
        .addBubble('Test')
        .addButton('Title 1', 1);

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(generic.bubbles[0].buttons[0].type).toBe('postback');
      expect(generic.bubbles[0].buttons[0].payload).toBe(1);
      expect(generic.bubbles[0].buttons[0].url).not.toBeDefined();
    });

    it('should add a button with title and payload if you pass valid format', () => {
      generic
        .addBubble('Test')
        .addButton('Title 1', 'http://google.com');

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(generic.bubbles[0].buttons[0].type).toBe('web_url');
      expect(generic.bubbles[0].buttons[0].url).toBe('http://google.com');
      expect(generic.bubbles[0].buttons[0].payload).not.toBeDefined();
    });

    it('should add 3 buttons with valid titles and formats', () => {
      generic
        .addBubble('Test')
        .addButton('b1', 'v1')
        .addButton('b2', 'v2')
        .addButton('b3', 'v3');

      expect(generic.bubbles[0].buttons.length).toBe(3);
      expect(generic.bubbles[0].buttons[0].title).toBe('b1');
      expect(generic.bubbles[0].buttons[0].payload).toBe('v1');
      expect(generic.bubbles[0].buttons[1].title).toBe('b2');
      expect(generic.bubbles[0].buttons[1].payload).toBe('v2');
      expect(generic.bubbles[0].buttons[2].title).toBe('b3');
      expect(generic.bubbles[0].buttons[2].payload).toBe('v3');
    });

    it('should throw an error if you add more than 3 buttons', () => {
      generic
        .addBubble('Test');

      expect(() => {
        generic
          .addButton('Title 1', 1)
          .addButton('Title 2', 2)
          .addButton('Title 3', 3)
          .addButton('Title 4', 4);
      }).toThrowError('3 buttons are already added and that\'s the maximum');
    });

    it('should throw an error if there\'s more than 10 bubbles', () => {
      expect(() =>
        generic
          .addBubble('1', 'hello')
          .addBubble('2', 'hello')
          .addBubble('3', 'hello')
          .addBubble('4', 'hello')
          .addBubble('5', 'hello')
          .addBubble('6', 'hello')
          .addBubble('7', 'hello')
          .addBubble('8', 'hello')
          .addBubble('9', 'hello')
          .addBubble('10', 'hello')
          .addBubble('11', 'hello')
      )
      .toThrowError('10 bubbles are maximum for Generic template');
    });

    it('should return a formated object in the end', () => {
      expect(
        generic
          .addBubble('Title')
          .get()
      ).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'Title'
            }]
          }
        }
      });
    });
  });

  xdescribe('Button template', () => {

  });

  xdescribe('Receipt template', () => {

  });

  xdescribe('Image attachment', () => {

  });
});