import React, { useCallback, useMemo, useRef } from 'react';
import { Just } from 'folktale/maybe';
import * as azimuth from 'azimuth-js';
import { Grid, H4 } from 'indigo-react';
import { FORM_ERROR } from 'final-form';

import View from 'components/View';
import { ForwardButton } from 'components/Buttons';
import Passport from 'components/Passport';
import WarningBox from 'components/WarningBox';
import FooterButton from 'components/FooterButton';

import { useNetwork } from 'store/network';
import { useHistory } from 'store/history';

import * as need from 'lib/need';
import { ROUTE_NAMES } from 'lib/routeNames';
import { DEFAULT_HD_PATH, walletFromMnemonic } from 'lib/wallet';
import { generateWallet } from 'lib/invite';
import { generateTemporaryOwnershipWallet } from 'lib/walletgen';
import { useLocalRouter } from 'lib/LocalRouter';
import useImpliedTicket from 'lib/useImpliedTicket';
import timeout from 'lib/timeout';
import useHasDisclaimed from 'lib/useHasDisclaimed';
import useBreakpoints from 'lib/useBreakpoints';

import BridgeForm from 'form/BridgeForm';
import SubmitButton from 'form/SubmitButton';
import { TicketInput } from 'form/Inputs';
import {
  composeValidator,
  buildPatqValidator,
  hasErrors,
} from 'form/validators';
import FormError from 'form/FormError';

import { useActivateFlow } from './ActivateFlow';
import { hasWarnings } from 'form/helpers';

export default function ActivateCode() {
  const history = useHistory();
  const { names, push } = useLocalRouter();
  const { contracts } = useNetwork();
  const impliedTicket = useImpliedTicket();
  const [hasDisclaimed] = useHasDisclaimed();
  const warnings = useRef({});

  const {
    setDerivedWallet,
    setInviteWallet,
    derivedPoint,
    setDerivedPoint,
  } = useActivateFlow();
  // this is a pretty naive way to detect if we're on a mobile device
  // (i.e. we're checking the width of the screen)
  // but it will suffice for the 99% case and if someone wants to get around it
  // well by golly they're allowed to turn their phone into landscape mode
  // for this screen
  const activationAllowed = useBreakpoints([false, true, true]);

  const goToLogin = useCallback(() => history.popAndPush(ROUTE_NAMES.LOGIN), [
    history,
  ]);

  const goToPassport = useCallback(() => {
    push(names.PASSPORT);

    if (!hasDisclaimed) {
      push(names.DISCLAIMER);
    }
  }, [hasDisclaimed, names.DISCLAIMER, names.PASSPORT, push]);

  const validateForm = useCallback((values, errors) => {
    warnings.current.ticket = null;

    if (hasErrors(errors)) {
      return errors;
    }
  }, []);

  const validate = useMemo(
    () => composeValidator({ ticket: buildPatqValidator() }, validateForm),
    [validateForm]
  );

  // set our state on submission
  const onSubmit = useCallback(
    async values => {
      await timeout(16); // allow the ui changes to flush before we lag it out

      const _contracts = need.contracts(contracts);
      const { seed } = await generateTemporaryOwnershipWallet(values.ticket);

      const inviteWallet = walletFromMnemonic(seed, DEFAULT_HD_PATH);

      const _inviteWallet = need.wallet(inviteWallet);

      const owned = await azimuth.azimuth.getOwnedPoints(
        _contracts,
        _inviteWallet.address
      );
      const transferring = await azimuth.azimuth.getTransferringFor(
        _contracts,
        _inviteWallet.address
      );
      const incoming = [...owned, ...transferring];

      if (incoming.length > 0) {
        if (incoming.length > 1) {
          warnings.current.ticket =
            'This invite code has multiple points available.\n' +
            "Once you've activated this point, activate the next with the same process.";
        }

        const point = parseInt(incoming[0], 10);

        setDerivedPoint(Just(point));
        setInviteWallet(inviteWallet);
        setDerivedWallet(Just(await generateWallet(point)));
      } else {
        return {
          [FORM_ERROR]:
            'Invite code has no claimable point.\n' +
            'Check your invite code and try again?',
        };
      }
    },
    [contracts, setDerivedPoint, setDerivedWallet, setInviteWallet]
  );

  const afterSubmit = useCallback(() => {
    if (hasWarnings(warnings.current)) {
      return;
    }

    goToPassport();
  }, [goToPassport]);

  const initialValues = useMemo(() => ({ ticket: impliedTicket || '' }), [
    impliedTicket,
  ]);

  return (
    <View inset>
      <Grid>
        <Grid.Item full as={Passport} point={derivedPoint} />
        <Grid.Item full as={H4} className="mt3 mb2">
          Activate
        </Grid.Item>
        <BridgeForm
          validate={validate}
          onSubmit={onSubmit}
          afterSubmit={afterSubmit}
          initialValues={initialValues}>
          {({ validating, submitting, submitSucceeded, handleSubmit }) => (
            <>
              <Grid.Item
                full
                as={TicketInput}
                name="ticket"
                label="Activation Code"
                disabled={!activationAllowed}
                warning={warnings.current.ticket}
              />

              <Grid.Item full as={FormError} />

              {submitSucceeded ? (
                <Grid.Item
                  full
                  as={ForwardButton}
                  solid
                  className="mt4"
                  onClick={goToPassport}>
                  Continue Activation
                </Grid.Item>
              ) : (
                <Grid.Item
                  full
                  as={SubmitButton}
                  className="mt4"
                  handleSubmit={handleSubmit}>
                  {validating
                    ? 'Deriving...'
                    : submitting
                    ? 'Generating...'
                    : 'Go'}
                </Grid.Item>
              )}

              {!activationAllowed && (
                <Grid.Item full as={WarningBox} className="mt4">
                  For your security, please access Bridge on a desktop device.
                </Grid.Item>
              )}
            </>
          )}
        </BridgeForm>
      </Grid>

      <FooterButton as={ForwardButton} onClick={goToLogin}>
        Login
      </FooterButton>
    </View>
  );
}
