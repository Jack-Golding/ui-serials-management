import { Suspense, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import { AppContextMenu } from '@folio/stripes/core';

import {
  CommandList,
  importShortcuts,
  HasCommand,
  KeyboardShortcutsModal,
  checkScope,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';

import {
  SerialsRoute,
  SerialCreateRoute,
  SerialEditRoute,
  RulesetCreateRoute,
  ExpectedPiecesRoute,
  PatternsRoute,
} from './routes';

import Settings from './settings';

const App = (props) => {
  const [showShortcutModal, setShowShortcutModal] = useState(false);

  const {
    actAs,
    match: { path },
  } = props;

  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-serials-management');

  if (actAs === 'settings') {
    return (
      <Suspense fallback={null}>
        <Settings {...props} />
      </Suspense>
    );
  }

  const keyboardShortcuts = importShortcuts([
    'new',
    'edit',
    'save',
    'expandAllSections',
    'collapseAllSections',
    'expandOrCollapseAccordion',
    'search',
    'openShortcutModal',
  ]);

  const changeShortcutsModal = () => {
    setShowShortcutModal(!showShortcutModal);
  };

  const shortcuts = [
    {
      name: 'openShortcutModal',
      handler: changeShortcutsModal,
    },
  ];

  return (
    <>
      <CommandList commands={keyboardShortcuts}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {(handleToggle) => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => {
                      handleToggle();
                      setShowShortcutModal(true);
                    }}
                  >
                    <FormattedMessage id="ui-serials-management.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
          <Suspense fallback={null}>
            <Switch>
              <Route
                component={SerialCreateRoute}
                path={`${path}/serials/create`}
              />
              <Route
                component={SerialEditRoute}
                path={`${path}/serials/:id/edit`}
              />
              <Route
                component={RulesetCreateRoute}
                path={`${path}/serials/:id/rulesets/create`}
              />
              <SerialsRoute path={`${path}/serials`} />
              <ExpectedPiecesRoute path={`${path}/expectedPieces`} />
              <PatternsRoute path={`${path}/patterns`} />
            </Switch>
          </Suspense>
        </HasCommand>
      </CommandList>
      {showShortcutModal && (
        <KeyboardShortcutsModal
          allCommands={keyboardShortcuts}
          onClose={changeShortcutsModal}
        />
      )}
    </>
  );
};

App.propTypes = {
  actAs: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
};

export default App;
