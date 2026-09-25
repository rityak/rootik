import type { Story } from "@ladle/react";
import { Card, Prose } from "..";

export default { title: "Display" };

export const ProseText: Story = () => (
  <Card style={{ maxWidth: 680 }}>
    <Prose>
      <h1>Dataset Toolkit 0.14</h1>
      <p>
        This release makes <strong>large datasets</strong> pleasant to work with: the gallery is virtualized,
        captions edit inline and training resumes after a crash. Read the{" "}
        <a href="#migration">migration notes</a> before updating a running project.
      </p>
      <h2>Highlights</h2>
      <ul>
        <li>
          Gallery scrolls 5 000+ images smoothly; select with <kbd>Shift</kbd>+click
        </li>
        <li>
          Tag autocomplete from the dataset vocabulary
          <ul>
            <li>
              works in the caption editor and the <code>--tags</code> filter
            </li>
          </ul>
        </li>
        <li>Log dock follows the tail and counts new lines</li>
      </ul>
      <h3 id="migration">Migration</h3>
      <ol>
        <li>Stop running jobs</li>
        <li>
          Rename <code>train.toml</code> keys:
        </li>
      </ol>
      <pre>
        <code>{`[training]
lr_scheduler = "cosine_with_restarts"  # was: scheduler
save_every_n_epochs = 1`}</code>
      </pre>
      <blockquote>Checkpoints from 0.13 load as they are; only the config changed.</blockquote>
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>0.13</th>
            <th>0.14</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>scheduler</code>
            </td>
            <td>cosine</td>
            <td>renamed</td>
          </tr>
          <tr>
            <td>
              <code>buckets</code>
            </td>
            <td>fixed</td>
            <td>per aspect step</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <p>Thanks to everyone who reported issues.</p>
    </Prose>
  </Card>
);
