// Rules managing the right to move cards between stacks

import { Injectable } from '@angular/core';

import { Card, CardType } from './card.model';
import { Deck } from './deck.model';
import { Stack, Spread, StackTypes } from './stack.model';
import { Player } from './player.model';

import { AppState } from './../app.service';

  // General rules

const colorIsDifferent = (stack: Stack, card: Card): boolean => {
  return card.type.color !== stack.top.type.color;
};

const colorIsSame = (stack: Stack, card: Card): boolean => {
  return card.type.color === stack.top.type.color;
};

const suitIsSame = (stack: Stack, card: Card): boolean => {
  return card.type.name === stack.top.type.name;
};

const isOwner = (stack: Stack, player: Player): boolean => {
  return stack.owner.id === player.id;
};

const isOnTop = (stack: Stack, card: Card): boolean => {
  return card === stack.top;
};

const valueIsNeighbour = (stack: Stack, card: Card): boolean => {
  return Math.abs(card.value - stack.top.value) === 1;
};

const valueIsOneMore = (stack: Stack, card: Card): boolean => {
  return card.value - stack.top.value === 1;
};

const valueIsOneLess = (stack: Stack, card: Card): boolean => {
  return card.value - stack.top.value === -1;
};

const lastIsNotKing = (stack: Stack): boolean => {
  return stack.top.value !== 13; // TODO
};

  // Pick up rules

export const pickupAlways = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return isOnTop(stack, card);
};

export const pickupNever = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return false;
};

export const pickupOwner = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return isOnTop(stack, card)
     && isOwner(stack, player);
};

export const pickupDiscard = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return isOnTop(stack, card)
    && isOwner(stack, player)
    && appState.get('stacks')['player' + player.id + 'Crapette'].deck.cards.length === 0;
};

// Push rules

export const pushAlways = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return true;
};

export const pushNever = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return false;
};

export const pushDiscard = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  if (isOwner(stack, player) && stackFrom.type === StackTypes.MAIN) {
    return true;
  } else if (isOwner(stack, player)) {
    return false;
  }
  if (stack.deck.cards.length === 0) {
    return false;
  }

  return lastIsNotKing(stack)
    && colorIsDifferent(stack, card)
    && valueIsNeighbour(stack, card);
};

export const pushCrapette = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return stack.deck.cards.length !== 0
    && !isOwner(stack, player)
    && lastIsNotKing(stack)
    && suitIsSame(stack, card)
    && valueIsNeighbour(stack, card);
};

export const pushAces = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  if (stack.deck.cards.length === 0) {
    if (card.value === 1) {
      return true;
    }
    return false;
  }

  return valueIsOneMore(stack, card)
    && suitIsSame(stack, card);
};

export const pushStreets = (stack: Stack, card: Card, appState: AppState, player: Player, stackFrom: Stack): boolean => {
  return stack.deck.cards.length === 0
    || (colorIsDifferent(stack, card)
        && valueIsOneLess(stack, card));
};
