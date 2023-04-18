import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { selectClient } from '@entities/client/model';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ROUTES } from '@shared/const/routes';
import { ClientAPI } from '@shared/lib/api';
import css from './ClientSettings.module.scss';
import { Divider } from 'primereact/divider';
import { ClientSettingsGroup } from '@pages/Target/TargetSettingsPage/ui/ClientSettingsGroup/ui/ClientSettingsGroup';
import { Loader } from '@shared/ui';
import { Client } from '@entities/client';

export const ClientSettings = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const selectedClient = useAppSelector((state: RootState) => state.selectedClient);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams<{ clientId: string }>();

  useEffect(() => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);

      const client = selectedClient.id
        ? selectedClient
        : res.data.find((client) => client.id === (+params.clientId! || res.data[0].id));

      if (client) {
        dispatch(selectClient(client));
      } else {
        dispatch(selectClient(res.data[0]));
      }
      navigate(`${ROUTES.TARGET.Settings}/client/${client ? client.id : res.data[0].id}`);
    });
  }, []);

  const handleClientChange = (e: ListBoxChangeEvent) => {
    if (e.value) {
      dispatch(selectClient(clients.find((client) => client.id === e.value)));
      navigate(`${ROUTES.TARGET.Settings}/client/${e.value}`);
    }
  };

  return (
    <div className={css.container}>
      <ListBox
        className={css.clientList}
        listStyle={{ height: 'calc(100% - 61px)' }}
        value={selectedClient.id}
        filter
        filterPlaceholder='Поиск'
        options={clients}
        optionValue='id'
        optionLabel='name'
        onChange={handleClientChange}
      />

      <div className={css.settings}>
        <div className={css.settings__list}>
          {!selectedClient.id ? (
            <Loader />
          ) : (
            <>
              <p className={css.settings__title}>{selectedClient.name}</p>
              <div>
                <Divider style={{ marginTop: 0 }} id='main' align='left'>
                  <a className={css.settings__list__anchor} href='#main'>
                    # Группы
                  </a>
                </Divider>
                <ClientSettingsGroup client={selectedClient} />
              </div>
              <Divider id='tags' align='left'>
                <a href='#tags' className={css.settings__list__anchor}>
                  # Теги
                </a>
              </Divider>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cupiditate delectus
                facere fuga illo in labore laboriosam maxime necessitatibus nobis odio porro quasi
                quidem, quis repellat saepe sapiente tempore, veritatis.
              </p>
              <p>
                Aliquam architecto beatae commodi consequuntur dolore libero perspiciatis soluta
                voluptas. Asperiores laborum molestiae possimus. Accusamus cum delectus deserunt,
                doloribus, ipsa, laudantium perferendis praesentium quasi qui quia reiciendis rem
                vel voluptas.
              </p>
              <p>
                Consectetur earum explicabo facere, magni maiores nihil nobis optio praesentium
                ratione reprehenderit sunt temporibus ut voluptas! Ab architecto est expedita
                explicabo hic ipsam, iusto quia quisquam, sequi tempore temporibus voluptas!
              </p>
              <p>
                Culpa, optio, voluptas! At blanditiis fugit magnam perspiciatis quasi. Accusamus
                assumenda consequatur, dolore doloremque ducimus eum eveniet in ipsa itaque,
                laboriosam nam necessitatibus nemo odit quasi rem sequi ullam, veniam?
              </p>
              <p>
                A ad architecto aspernatur at, consequuntur corporis cum, deserunt distinctio dolore
                eaque eveniet facilis harum ipsa iusto labore minima nam nobis odit possimus
                provident quasi quis sapiente, suscipit tempore veniam?
              </p>
              <p>
                A ab accusamus adipisci aliquam amet aut cupiditate delectus deserunt ducimus,
                facilis itaque repudiandae, saepe velit! Amet consequatur, corporis debitis
                doloribus in maxime nostrum officia quia quis quod soluta veritatis.
              </p>
              <p>
                A ad architecto assumenda dignissimos fugit illo ipsa iure laboriosam molestiae
                nemo, porro sed, similique soluta ut voluptatem? Aliquid animi facilis natus
                provident quam reiciendis sunt suscipit! Ab, culpa, cupiditate.
              </p>
              <p>
                Atque cupiditate maiores quibusdam? Ab amet at commodi consectetur distinctio,
                dolore dolorum et exercitationem facilis harum in itaque nesciunt nihil officiis
                omnis qui quo recusandae reprehenderit sequi suscipit velit voluptate?
              </p>
              <p>
                A accusamus aperiam asperiores aut autem ea eaque esse eum facilis iste iusto libero
                magni minus placeat quaerat quis quisquam quo ratione recusandae repellendus,
                repudiandae saepe suscipit temporibus, vel, voluptas?
              </p>
              <p>
                Accusamus animi autem consequuntur cum debitis enim esse eveniet ex hic magnam
                maiores molestias neque nisi nobis pariatur perspiciatis, quidem quis ratione
                repellat sit, ut vel voluptate. Amet, ducimus iure?
              </p>
              <p>
                Adipisci aliquam culpa cum cumque excepturi incidunt nemo officiis quam repudiandae
                saepe sapiente, sequi ullam unde. Aliquam consectetur cum facere impedit porro, qui
                sequi sint tempora velit. Debitis, doloribus illo?
              </p>
              <p>
                Eveniet quae quia voluptatum? Ab aliquam architecto autem corporis deleniti dolore
                eligendi error facilis iusto laborum molestias nam non numquam pariatur possimus
                quas reprehenderit, sit soluta sunt unde velit veniam.
              </p>
              <p>
                Accusamus aliquid architecto deleniti deserunt eos excepturi facere incidunt ipsam
                modi mollitia praesentium repellendus suscipit tenetur, voluptas voluptatum? Animi
                deserunt doloremque dolorum ea error fugit necessitatibus optio quibusdam rerum
                tempore.
              </p>
              <p>
                Accusamus aut commodi eum incidunt inventore molestias neque, nobis non nulla
                obcaecati, omnis, perspiciatis quam quod rem sint sunt tempore voluptatum.
                Doloremque ea iure numquam odit qui ratione ullam veniam.
              </p>
              <p>
                Consequatur ducimus illum iste libero, modi nulla odit pariatur quaerat qui rerum.
                Adipisci corporis cupiditate delectus enim, inventore magni maxime neque nobis
                officia, quaerat repudiandae sed soluta voluptate! Dicta, soluta.
              </p>
              <p>
                Accusamus amet corporis culpa dignissimos eius est et explicabo facilis fuga illum
                iure laboriosam laudantium magnam maiores minima nam quaerat quas quis, quod
                repellat sequi ullam velit vero. Ad, earum?
              </p>
              <p>
                Amet maiores nihil qui quidem tempora? Alias aliquid animi at beatae consequuntur
                culpa delectus distinctio dolorum eveniet ex explicabo, id modi molestiae, mollitia
                natus nemo, obcaecati qui quibusdam soluta voluptate!
              </p>
              <p>
                Esse fugit tempora ut voluptatibus. A, deserunt dolore ea excepturi impedit ipsum
                nihil officia porro quo repellendus reprehenderit sit velit voluptates. Dignissimos
                iusto laboriosam, laudantium nam perspiciatis placeat veritatis. Hic.
              </p>
              <p>
                Itaque, quis, recusandae. Aperiam consectetur dolores earum eligendi fugiat, id
                itaque officia praesentium. Hic natus nisi omnis vero! Autem eos fugiat hic illo
                nemo neque nostrum quae quos unde vero!
              </p>
              <p>
                A consectetur deleniti eius, ex fugiat incidunt mollitia nam, nemo perferendis qui
                quis temporibus ullam voluptates! Consequuntur enim et eum exercitationem explicabo
                iure laboriosam ullam vero voluptatum! Nostrum, quam, rem.
              </p>
            </>
          )}
        </div>
        <Divider layout='vertical' />
        <div className={css.settings__panel}>
          <a href='#main' className={css.settings__panel__anchor}>
            # Группы
          </a>
          <a href='#tags' className={css.settings__panel__anchor}>
            # Теги
          </a>
        </div>
      </div>
    </div>
  );
};
